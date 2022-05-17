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

/**
 * Mark the function as a route and register it to the `Server`.
 * @param path If the path is not provided, the function name will be used.
 */
export const route = (path?: string) => {
  return (
    // deno-lint-ignore no-explicit-any
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    target.addRoute(path || `/${key.toString()}`, descriptor.value);

    return descriptor;
  };
};

/**
 * Mark the function as a hook and register it to the `Server`.
 * @param hook The type of hook which the function will be called for.
 */
export const hook = (hook?: Hook) => {
  return (
    // deno-lint-ignore no-explicit-any
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    let type;

    if (hook) {
      type = hook;
    } else {
      switch (key) {
        case "onPreRoute":
          {
            type = Hook.ON_PRE_ROUTE;
          }
          break;
        case "onPostRoute":
          {
            type = Hook.ON_POST_ROUTE;
          }
          break;
        case "onError":
          {
            type = Hook.ON_ERROR;
          }
          break;
        default: {
          throw new Error(
            `Unknown hook type: '${key.toString()}'. Did you forget to ` +
              "specify the hook type?`",
          );
        }
      }
    }

    target.addHook(type, descriptor.value);

    return descriptor;
  };
};
