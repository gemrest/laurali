// This file is part of Laurali <https://github.com/gemrest/laurali>.
// Copyright (C) 2022-2022 Fuwn <contact@fuwn.me>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, version 3.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
//
// Copyright (C) 2022-2022 Fuwn <contact@fuwn.me>
// SPDX-License-Identifier: GPL-3.0-only

import { Hook } from "./hooks.ts";

export interface ServerConfiguration {
  port?: number;
  hostname?: string;
  logger?: boolean;
}

/** The base Laurali server to be extended upon */
export abstract class Server {
  /**
   * The internal `Deno.TlsListener` which listens for and accepts client
   * connections.
   */
  #listener: Deno.TlsListener;
  /** All registered route functions of the `Server` */
  // deno-lint-ignore no-explicit-any
  static #routes: Map<string, (ctx: Deno.TlsConn) => any> = new Map();
  /** All registered hook functions of the `Server` */
  static #hooks: Map<Hook, (ctx: Deno.TlsConn) => void> = new Map();
  /** The port of the `Server` */
  static #port: number;
  /** The hostname of the `Server` */
  static #hostname: string;

  constructor(
    certFile: string,
    keyFile: string,
    config?: ServerConfiguration,
  ) {
    const port = config?.port || 1965;
    const hostname = config?.hostname || "0.0.0.0";

    Server.#port = port;
    Server.#hostname = hostname;

    this.#listener = Deno.listenTls({
      port,
      hostname,
      certFile,
      keyFile,
    });
  }

  /** Add a route function to the `Server` */
  // deno-lint-ignore no-explicit-any
  addRoute(route: string, handler: () => any) {
    Server.#routes.set(route, handler);
  }
  /** Add a hook function to the `Server` */
  addHook(hook: Hook, handler: () => void) {
    Server.#hooks.set(hook, handler);
  }

  /** Get the `port` of the `Server` */
  static get port() {
    return Server.#port;
  }

  /** Get the `hostname` of the `Server` */
  static get hostname() {
    return Server.#hostname;
  }

  /** Called before a connection to a client has been responded to */
  protected onPreRoute?(ctx: Deno.TlsConn): void;

  /** Called after a connection to a client has concluded */
  protected onPostRoute?(ctx: Deno.TlsConn): void;

  /** Called before the `Server` starts listening for connections */
  protected onListen?(): void;

  /**
   * The response delivered to a client when the `Server` experiences any error
   * while evaluating the result of a route function, or if the `Server` cannot
   * find a route function for a given path.
   */
  protected onError?(): void;

  /** Start listening and responding to client connections */
  async listen() {
    // If the `Server` has an `onListen` hook, call it.
    if (this.onListen) this.onListen();

    // Listen for connections and handle them.
    for await (const r of this.#listener) {
      const b = new Uint8Array(1026);
      let n;

      try {
        n = await r.read(b);
      } catch (error) {
        console.log(error);
        r.close();

        continue;
      }

      const onPreRoute = Server.#hooks.get(Hook.ON_PRE_ROUTE);
      const onPostRoute = Server.#hooks.get(Hook.ON_POST_ROUTE);
      const onError = Server.#hooks.get(Hook.ON_ERROR);

      // Make sure that the client has sent a request.
      if (n === null) {
        console.log("could not read from client");
        r.close();

        continue;
      }

      const path = String.fromCharCode(...b.subarray(0, n)).replace(
        /\r\n$/,
        "",
      ).replace(/gemini:\/\//, "");

      // If the `Server` has an `onPreRoute` hook, call it.
      if (onPreRoute) onPreRoute(r);

      // Respond to index requests.
      if (path.endsWith("/") || path.endsWith("localhost")) {
        const route = Server.#routes.get("/");
        let response;

        if (route === undefined) {
          if (onError) {
            response = onError(r);
          } else {
            response = "The server (Laurali) could not find that route.";
          }
        } else {
          response = route(r);
        }

        await r.write(
          (new TextEncoder()).encode(
            `20 text/gemini\r\n${response}`,
          ),
        );
        r.close();
      } else { // Respond to another other request.
        const route = Server.#routes.get(path.replace("localhost", ""));
        let response;

        if (route === undefined) {
          if (onError) {
            response = onError(r);
          } else {
            response = "The server (Laurali) could not find that route.";
          }
        } else {
          response = route(r);
        }

        await r.write(
          (new TextEncoder()).encode(
            `20 text/gemini\r\n${response}`,
          ),
        );
        r.close();
      }

      // If the `Server` has an `onPostRoute` hook, call it.
      if (onPostRoute) onPostRoute(r);

      continue;
    }
  }
}
