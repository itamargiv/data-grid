{ sources ? import ./nix/sources.nix
, pkgs ? import sources.nixpkgs {}
}:

pkgs.mkShell {
	buildInputs = [ pkgs.nodejs-16_x ];
}
