<h1 align="center">Laurali</h1>
<p align="center"><b>An object-oriented Gemini server for Deno!</b></p>

- Super simple
- Object-oriented
- Decorators!
- Fun!

## Usage

The latest stable release of Laurali can be `import`ed from
[deno.land/x](https://deno.land/x) using https://deno.land/x/laurali/mod.ts, or,
you can `import` the latest bleeding-edge commit straight from GitHub using
https://raw.githubusercontent.com/gemrest/laurali/main/mod.ts.

## Documentation

The latest documentation ([main](https://github.com/gemrest/laurali/tree/main))
is available
[here](https://doc.deno.land/https/raw.githubusercontent.com/gemrest/laurali/main/mod.ts),
and the latest stable documentation is available
[here](https://doc.deno.land/https/deno.land/x/laurali/mod.ts).

## Example

To create a simple Laurali server, you must first have a valid OpenSSL keypair.
You can create a new OpenSSL keypair using the provided script by running

```shell
# Requires that you have both Deno and OpenSSL installed on your system

$ deno run --allow-write --allow-run --allow-net --allow-read https://deno.land/x/laurali/key.ts # Optionally, `--overwrite`
```

You can then begin to implement your very own Laurali server.

```ts
import {
  Callback,
  callback,
  route,
  Server,
} from "https://deno.land/x/laurali/mod.ts";

class MyCoolServer extends Server {
  /** Visit `/hi` */
  @route()
  hi() {
    return "Hello, World!";
  }
}
```

After you have implemented your Laurali server, start listening for connections!

```ts
// `deno run --allow-net --allow-read https://deno.land/x/examples/my_cool_server.ts`

(new MyCoolServer(".laurali/public.pem", ".laurali/private.pem")).listen();
```

More examples can be found in the [`examples/`](examples) directory.

## License

This project is licensed with the [GNU General Public License v3.0](LICENSE).
