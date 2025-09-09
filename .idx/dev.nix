let
  pkgs = import <nixpkgs> {};
in
pkgs.mkShell {
  name = "leadscoringapp-dev";

  buildInputs = [
    pkgs.nodejs_22
    pkgs.yarn
    pkgs.git
    pkgs.gnumake
    pkgs.pre-commit
  ];

  shellHook = ''
    export NODE_OPTIONS="--max-old-space-size=4096"
    echo "Dev shell ready — node $(node --version 2>/dev/null || echo 'n/a')"
    # Optional: auto-install pre-commit hooks
    if [ -d .git ] && ! git rev-parse --git-dir >/dev/null 2>&1; then
      # Not a git repo
      :
    else
      pre-commit install || true
    fi
  '';
}
