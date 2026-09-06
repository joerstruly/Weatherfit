"""Build synthetic PDFs shaped like the real documents in the catalog.

Two shapes cover most of what the catalog holds:
  ruled   - a bordered table, like a DOT bid item price report
  stream  - whitespace-aligned columns with no rules, like many bid tabs
"""
import pymupdf

ROWS = [
    ("0201-0010", "REINFORCING STEEL",            "LB",  "1,284,500", "1.24",   "1592780.00"),
    ("0201-0020", "EPOXY COATED REINF STEEL",     "LB",    "412,300", "1.61",    "663803.00"),
    ("0501-0100", "STRUCTURAL STEEL",             "LB",    "228,900", "13.00",  "2975700.00"),
    ("0601-0300", "CLASS A45 CONCRETE",           "CY",      "8,420", "184.50",  "1553490.00"),
    ("0701-0050", "PRECAST CONC BOX CULVERT",     "LF",      "1,150", "742.00",   853300.00 and "853300.00"),
    ("0901-0010", "MOBILIZATION",                 "LS",          "1", "425000.00","425000.00"),
]
TOTAL = "8064073.00"   # = sum(ROWS amounts)
HEADERS = ("ITEM CODE", "DESCRIPTION", "UNIT", "QUANTITY", "UNIT PRICE", "AMOUNT")
COLX = [40, 130, 330, 380, 470, 560]   # left edge of each column
RIGHT = 700

def _text(page, x, y, s, size=8, bold=False):
    page.insert_text((x, y), s, fontname="hebo" if bold else "helv", fontsize=size)

def build(path, ruled=True):
    doc = pymupdf.open()
    page = doc.new_page(width=740, height=400)
    _text(page, 40, 40, "STATE DEPARTMENT OF TRANSPORTATION", 11, True)
    _text(page, 40, 55, "BID ITEM PRICE REPORT - CALENDAR YEAR 2024", 9)
    _text(page, 40, 68, "Letting: 2024-03-19    Project: NH-0034(12)    County: EXAMPLE", 8)

    y0 = 95
    for i, h in enumerate(HEADERS):
        _text(page, COLX[i] + 2, y0, h, 8, True)

    y = y0 + 16
    for r in ROWS:
        for i, cell in enumerate(r):
            # right-align the three numeric columns, as real reports do
            if i >= 3:
                w = pymupdf.get_text_length(cell, fontname="helv", fontsize=8)
                nx = (COLX[i + 1] if i + 1 < len(COLX) else RIGHT) - 6 - w
                _text(page, nx, y, cell)
            else:
                _text(page, COLX[i] + 2, y, cell)
        y += 14

    y += 6
    _text(page, COLX[1] + 2, y, "TOTAL", 8, True)
    w = pymupdf.get_text_length(TOTAL, fontname="hebo", fontsize=8)
    _text(page, RIGHT - 6 - w, y, TOTAL, 8, True)

    if ruled:
        top, bot = y0 - 10, y + 6
        for x in COLX + [RIGHT]:
            page.draw_line((x, top), (x, bot), width=0.5)
        yy = top
        page.draw_line((COLX[0], yy), (RIGHT, yy), width=0.5)
        yy = y0 + 4
        page.draw_line((COLX[0], yy), (RIGHT, yy), width=0.5)
        for _ in ROWS:
            yy += 14
            page.draw_line((COLX[0], yy), (RIGHT, yy), width=0.5)
        page.draw_line((COLX[0], bot), (RIGHT, bot), width=0.5)

    doc.save(path)
    doc.close()

if __name__ == "__main__":
    build("tests/fixtures/dot_ruled.pdf", ruled=True)
    build("tests/fixtures/dot_stream.pdf", ruled=False)
    # Negative fixture: the printed total disagrees with the line items by $800.
    # A correct pipeline must refuse this, not average it away.
    globals()["TOTAL"] = "8064873.00"
    build("tests/fixtures/dot_bad_total.pdf", ruled=True)
    print("wrote fixtures")
