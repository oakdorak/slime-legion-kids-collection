#!/usr/bin/env python3
"""Generate NeuroDivertidos icons + splash from a single logo drawing."""
from PIL import Image, ImageDraw

BG = (43, 31, 36, 255)        # #2B1F24 dark
GOLD = (235, 230, 166, 255)   # #EBE6A6
DARK = (35, 31, 36, 255)      # #231F24 eye


def draw_logo(s, bg=BG, scale=1.0):
    im = Image.new("RGBA", (s, s), bg)
    cx, cy, cr = int(s * 0.5), int(s * 0.5), int(s * 0.36 * scale)
    circle = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(circle)
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=GOLD)
    for ex, ey in [(-s * 0.10, -s * 0.05), (s * 0.10, -s * 0.05)]:
        ecx, ecy, er = int(cx + ex), int(cy + ey), int(s * 0.05 * scale)
        draw.ellipse([ecx - er, ecy - er, ecx + er, ecy + er], fill=DARK)
    return Image.alpha_composite(im, circle)


def save(path, im):
    im.save(path)
    print("wrote", path)


save("icon-192.png", draw_logo(192))
save("icon-512.png", draw_logo(512))
save("icon-maskable-512.png", draw_logo(512, scale=1.0))
save("assets/icon.png", draw_logo(1024))
save("assets/splash.png", draw_logo(2732))
print("icons generated")
