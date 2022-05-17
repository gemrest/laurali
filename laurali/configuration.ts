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

/** Configuration options of a `Server`'s HTTP proxy */
export interface ProxyConfiguration {
  /** Allow Laurali to proxy */
  enable?: boolean;
  /**
   * The base URL of the HTTP proxy server
   * @default "https://fuwn/me/proxy/"
   */
  baseURL?: string;
  /**
   * The hostname of **this** Laurali server
   * @default ServerConfiguration.hostname
   */
  hostname?: string;
}

/** Configuration options of a `Server` */
export interface ServerConfiguration {
  /** The port a `Server` will listen on */
  port?: number;
  /** The hostname a `Server` will identify as */
  hostname?: string;
  /** Proxy your Gemini content by specifying an HTTP proxy */
  proxy?: ProxyConfiguration;
}
