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

/** An OpenSSL keypair config for use with `generateKey` */
export interface KeyConfig {
  /**
   * The subject of an OpenSSL keypair
   * @default "CN=localhost"
   */
  subj?: string;
  /**
   * The elliptic curve of an OpenSSL keypair
   * @default "secp256k1"
   */
  ec_paramgen_curve?: string;
  /**
   * The lifetime in days of an OpenSSL keypair
   * @default "365"
   */
  days?: string;
  /** The output file of an OpenSSL public key */
  out: string;
  /** The output file of an OpenSSL private key */
  keyOut: string;
  /**
   * The format of an OpenSSL keypair
   * @default "pem"
   */
  format?: string;
}

/**
 * Generate an OpenSSL keypair
 * @param config The configuration of the OpenSSL keypair
 */
export const generateKey = async (
  config: KeyConfig,
): Promise<Deno.ProcessStatus> => {
  return await Deno.run({
    cmd: [
      "openssl",
      "req",
      "-new",
      "-subj",
      config.subj || "/CN=localhost",
      "-x509",
      "-newkey",
      "ec",
      "-pkeyopt",
      `ec_paramgen_curve:${config.ec_paramgen_curve || "secp384r1"}`,
      "-days",
      config.days || "365",
      "-nodes",
      "-out",
      config.out,
      "-keyout",
      config.keyOut,
      "-inform",
      config.format || "pem",
    ],
    stdout: "piped",
  }).status();
};

/** https://stackoverflow.com/a/61868755/14452787 */
const exists = async (filename: string): Promise<boolean> => {
  try {
    await Deno.stat(filename);

    return true;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw e;
    }
  }
};

if (import.meta.main) {
  const { parse } = await import("https://deno.land/std@0.139.0/flags/mod.ts");

  await Deno.mkdir(".laurali", { recursive: true });

  const generate = async () => {
    await generateKey({
      subj: `/CN=${
        prompt(
          "Which common name (hostname) would you like to use for the " +
            "generated key?",
        )
      }`,
      out: `.laurali/public.pem`,
      keyOut: `.laurali/private.pem`,
    });
  };

  if (
    (await exists(".laurali/public.pem") ||
      await exists(".laurali/private.pem")) &&
    !parse(Deno.args, { "boolean": true }).overwrite
  ) {
    const overwrite = prompt(
      "⚠️  ️A file already exists at .laurali/public.pem or" +
        ".laurali/private.pem.\n   Overwrite? [y/n (y = yes overwrite, n = " +
        "no keep)]",
    );

    if (overwrite === "y") {
      generate();
    } else {
      throw new Error(
        "Requires overwrite permissions to file(s), run again with " +
          "the --overwrite flag",
      );
    }
  } else {
    generate();
  }
}
