"""
Derives the hero portrait cutout from the ORIGINAL client photo (assets/original/Pic-for-home-page.jpg).

Only the background (office wall/floor) is removed; the person is not retouched, recoloured or reshaped.
Output: assets/derived/portrait-cutout.png (RGBA). `npm run images` then makes the web versions.

Requires (not a project dependency — run in a separate virtualenv):
    pip install "rembg[cpu]"
    python scripts/make-portrait-cutout.py
Model: rembg "isnet-general-use" (chosen over u2net_human_seg, which left a white halo; alpha matting
was tested and rejected because it softened the hair edge).
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets' / 'original' / 'Pic-for-home-page.jpg'
OUT = ROOT / 'assets' / 'derived' / 'portrait-cutout.png'

# Framing: hair (with headroom) down to mid-calf. Below the knees the page fades the figure into the
# navy background with a CSS mask, so nothing important is cut. Coordinates are in the 1024×1536 original.
CROP = (250, 110, 870, 1270)  # left, top, right, bottom

img = Image.open(SRC).convert('RGB')
cut = remove(img, session=new_session('isnet-general-use'))
rgba = np.array(cut).astype(np.float32)
alpha = rgba[..., 3] / 255.0

# 1) Drop faint specks the model left in the background.
alpha[alpha < 0.06] = 0.0
labels, n = ndimage.label(alpha > 0)
if n > 1:
    sizes = ndimage.sum(np.ones_like(alpha), labels, range(1, n + 1))
    keep = 1 + int(np.argmax(sizes))
    alpha[labels != keep] = 0.0

# 2) Tighten the matte by ~1px so no wall-white rim remains, then re-smooth the edge.
a_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
alpha = np.array(a_img).astype(np.float32) / 255.0

# 3) Colour decontamination: edge pixels take the colour of the nearest fully opaque pixel,
#    so light background colour cannot bleed onto the navy page.
solid = alpha > 0.98
_, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
rgb = rgba[..., :3]
edge = (alpha > 0) & ~solid
rgb[edge] = rgb[iy[edge], ix[edge]]

out = np.dstack([rgb, alpha * 255.0]).clip(0, 255).astype(np.uint8)
result = Image.fromarray(out, 'RGBA').crop(CROP)
OUT.parent.mkdir(parents=True, exist_ok=True)
result.save(OUT, optimize=True)
print(f'Wrote {OUT.relative_to(ROOT)} {result.size}')
