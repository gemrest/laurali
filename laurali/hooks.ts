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

/** One of few hooks of a `Server` */
export const enum Hook {
  /** Called before a connection to a client has been responded to */
  ON_PRE_ROUTE = 0,
  /** Called after a connection to a client has concluded */
  ON_POST_ROUTE = 1,
  /**
   * The response delivered to a client when the `Server` experiences any error
   * while evaluating the result of a route function, or if the `Server` cannot
   * find a route function for a given path.
   */
  ON_ERROR = 2,
}
