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

import { Callback } from "./callbacks.ts";

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
    target.addRoute(path || key, descriptor.value);

    return descriptor;
  };
};

/**
 * Mark the function as a callback and register it to the `Server`.
 * @param callback The type of callback which the function will be called for.
 */
export const callback = (callback: Callback) => {
  return (
    // deno-lint-ignore no-explicit-any
    target: any,
    _key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    target.addCallback(callback, descriptor.value);

    return descriptor;
  };
};
