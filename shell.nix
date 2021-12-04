{ sources ? import ./nix/sources.nix
, pkgs ? import sources.nixpkgs {}
}:

pkgs.mkShell {
	buildInputs = [
		pkgs.git
		pkgs.nodejs-16_x
	];
}
