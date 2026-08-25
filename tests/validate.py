"""Validaciones estáticas sin dependencias externas."""

from html.parser import HTMLParser
from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parent.parent


class IdCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids: list[str] = []
        self.local_references: list[str] = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.append(attributes["id"])
        for name in ("src", "href"):
            value = attributes.get(name, "")
            if value and not value.startswith(("#", "http://", "https://", "data:")):
                self.local_references.append(value)


def main() -> int:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    parser = IdCollector()
    parser.feed(html)
    interface_revision_ok = (
        len(re.findall(r'class="phase-tab(?:\s|\")', html)) == 4
        and "Objetivo de la Corona" not in html
        and "Compendio 1561–1824" not in html
        and "pesos" not in html.lower()
        and 'id="player-role-display">Mercader<' in html
    )

    duplicate_ids = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
    missing_assets = sorted(
        reference
        for reference in parser.local_references
        if not (ROOT / reference).exists()
    )

    css = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
    css_balanced = css.count("{") == css.count("}")
    visual_map = ROOT / "assets" / "atlantic-chart-v1.png"
    visual_map_ready = (
        visual_map.exists()
        and visual_map.stat().st_size > 100_000
        and "../assets/atlantic-chart-v1.png" in css
        and 'id="campaign-map"' in html
        and 'id="map-fleet"' in html
    )
    implementation_report = ROOT / "docs" / "IMPLEMENTACION_REAL_CEDULA.md"
    report_complete = implementation_report.exists() and all(
        f"| {number}." in implementation_report.read_text(encoding="utf-8")
        for number in range(16)
    )
    canonical_ordinance = ROOT / "Real Cédula de la Real Compañía Carrera de Indias.md"
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    canonical_source_declared = (
        canonical_ordinance.exists()
        and "fuente canónica y guía principal" in readme
        and canonical_ordinance.name in readme
    )
    player_rules = ROOT / "REGLAS_DEL_JUEGO.md"
    player_rules_complete = player_rules.exists() and all(
        heading in player_rules.read_text(encoding="utf-8")
        for heading in ("## 2. Objetivo de la partida", "## 4. Las cuatro estaciones", "## 10. Una primera expedición recomendada")
    )

    replacement_errors = []
    text_suffixes = {".html", ".css", ".js", ".json", ".md", ".svg", ".py"}
    for path in ROOT.rglob("*"):
        if not path.is_file() or (path.suffix not in text_suffixes and path.name != ".gitignore"):
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        mojibake_leads = (chr(0x00C3), chr(0x00C2))
        if chr(0xFFFD) in text or any(marker in text for marker in mojibake_leads):
            replacement_errors.append(str(path.relative_to(ROOT)))

    failures = {
        "IDs duplicados": duplicate_ids,
        "recursos ausentes": missing_assets,
        "archivos con codificación sospechosa": replacement_errors,
        "CSS desequilibrado": [] if css_balanced else ["css/styles.css"],
        "carta atlántica visual incompleta": [] if visual_map_ready else [str(visual_map)],
        "matriz de la Real Cédula incompleta": [] if report_complete else [str(implementation_report)],
        "fuente canónica no declarada": [] if canonical_source_declared else [str(canonical_ordinance)],
        "reglas para jugadores incompletas": [] if player_rules_complete else [str(player_rules)],
        "revisión de interfaz incompleta": [] if interface_revision_ok else ["index.html"],
    }
    active_failures = {name: values for name, values in failures.items() if values}
    if active_failures:
        for name, values in active_failures.items():
            print(f"ERROR {name}: {values}")
        return 1

    print(f"OK: {len(parser.ids)} IDs únicos; recursos presentes; CSS y UTF-8 correctos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
