{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
	buildInputs = [
		pkgs.git
		pkgs.nodejs-16_x
	];
}
