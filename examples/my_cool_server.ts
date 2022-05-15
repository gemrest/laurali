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

import { callback, route, Server } from "../mod.ts";
import * as optic from "https://deno.land/x/optic@1.3.5/mod.ts";

/** Implement a new Laurali server */
class MyCoolServer extends Server {
  /** Track the number of total visits to our server */
  static clicks = 0;
  /** A logger to give us nice looking logs */
  static logger = new optic.Logger();

  /** Visit `/` */
  @route("/")
  index() {
    return "Hello, world!";
  }

  /** Visit `/test` */
  @route()
  test(ctx: Deno.TcpConn) {
    return 2 + ctx.localAddr.transport;
  }

  /** Visit `/random` */
  @route()
  random() {
    return Math.floor(Math.random() * 10);
  }

  /** Visit `/clicks` */
  @route("/clicks")
  clicksRoute() {
    return MyCoolServer.clicks;
  }

  @callback()
  override onPreRoute(ctx: Deno.TlsConn) {
    MyCoolServer.clicks += 1;

    MyCoolServer.logger.info(
      `Opened connection with ${ctx.remoteAddr.transport} and incremented ` +
        `\`clicks\` to ${MyCoolServer.clicks}.`,
    );
  }

  @callback()
  override onPostRoute() {
    MyCoolServer.logger.info("Closed connection.");
  }

  @callback()
  override onError() {
    return "hi";
  }

  override onListen() {
    MyCoolServer.logger.info(
      `Listening on ${MyCoolServer.hostname}:${MyCoolServer.port}.`,
    );
  }
}

(new MyCoolServer(".laurali/public.pem", ".laurali/private.pem")).listen();
