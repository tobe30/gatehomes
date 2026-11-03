from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "brickwire-social-mockup.png"
W = H = 1080
navy = (17, 35, 76)
cream = (248, 246, 239)
gold = (195, 162, 100)

def font(size, serif=False):
    candidates = ([r"C:\Windows\Fonts\georgiab.ttf", r"C:\Windows\Fonts\georgia.ttf"] if serif else
                  [r"C:\Windows\Fonts\arial.ttf"])
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

canvas = Image.new("RGB", (W, H), cream)
draw = ImageDraw.Draw(canvas)
# Soft, warm editorial backdrop
for y in range(H):
    t = y / H
    c = tuple(int(cream[i] * (1-t) + (235, 231, 219)[i] * t) for i in range(3))
    draw.line((0, y, W, y), fill=c)

# Header and brand lockup
draw.rounded_rectangle((62, 48, 109, 95), radius=11, fill=navy)
draw.text((75, 57), "B", font=font(29, True), fill=(255,255,255))
draw.text((124, 49), "BRICKWIRE", font=font(20), fill=navy)
draw.text((124, 75), "PROPERTIES  ·  LAGOS", font=font(11), fill=(111,111,105))
draw.text((62, 142), "A better way to find", font=font(50, True), fill=navy)
draw.text((62, 200), "your place in Lagos.", font=font(50, True), fill=navy)
draw.rounded_rectangle((62, 280, 284, 318), radius=19, fill=(234,226,207))
draw.text((79, 291), "HOMES · LAND · RENTALS", font=font(12), fill=navy)
draw.text((62, 342), "Explore the Brickwire Properties website", font=font(19), fill=(83,87,92))

# Floating browser card with a soft shadow
card = (62, 405, 1018, 973)
shadow = Image.new("RGBA", (W,H), (0,0,0,0))
sd = ImageDraw.Draw(shadow)
sd.rounded_rectangle((card[0]+5,card[1]+16,card[2]+5,card[3]+16), radius=25, fill=(15,25,40,58))
shadow = shadow.filter(ImageFilter.GaussianBlur(18))
canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow)
draw = ImageDraw.Draw(canvas)
draw.rounded_rectangle(card, radius=24, fill=(255,255,255,255), outline=(226,222,213,255), width=2)
# browser chrome
draw.rounded_rectangle((62,405,1018,463), radius=24, fill=(250,249,246,255))
draw.rectangle((62,439,1018,463), fill=(250,249,246,255))
for x,col in [(88,(222,132,119)),(108,(224,190,108)),(128,(130,181,139))]:
    draw.ellipse((x,428,x+10,438), fill=col)
draw.rounded_rectangle((368,419,761,449), radius=13, fill=(239,238,233))
draw.text((463,426), "brickwire-property.vercel.app", font=font(12), fill=(103,105,105))
# hero photo from the site
photo = Image.open(ROOT / "public" / "hero-home.jpg").convert("RGB")
pw, ph = photo.size
target = (62,463,1018,839)
tw, th = target[2]-target[0], target[3]-target[1]
scale = max(tw/pw, th/ph)
photo = photo.resize((int(pw*scale), int(ph*scale)), Image.Resampling.LANCZOS)
left=(photo.width-tw)//2; top=(photo.height-th)//2
photo=photo.crop((left,top,left+tw,top+th)).convert("RGBA")
overlay=Image.new("RGBA",photo.size,(8,17,36,95))
photo=Image.alpha_composite(photo,overlay)
canvas.alpha_composite(photo,(target[0],target[1]))
draw=ImageDraw.Draw(canvas)
draw.text((106, 502), "LAGOS  ·  SALES  ·  RENTALS  ·  LAND", font=font(13), fill=(246,239,221))
draw.text((106, 541), "Find your next property,", font=font(38, True), fill="white")
draw.text((106, 584), "effortlessly.", font=font(38, True), fill="white")
draw.text((106, 643), "Develop  ·  Buy  ·  Sell  ·  Invest.", font=font(17), fill=(244,242,236))
# search bar overlay
draw.rounded_rectangle((106, 704, 974, 803), radius=16, fill=(255,255,252,245))
draw.rounded_rectangle((126, 722, 545, 785), radius=10, outline=(220,218,210), width=2)
draw.text((148, 743), "Location e.g. Lekki", font=font(16), fill=(100,101,98))
draw.rounded_rectangle((560,722,738,785),radius=10,outline=(220,218,210),width=2)
draw.text((579,743),"Any price",font=font(15),fill=(70,73,77))
draw.rounded_rectangle((753,722,954,785),radius=10,fill=navy)
draw.text((808,743),"Search properties",font=font(14),fill="white")
# Featured listings peek beneath the hero, matching the live site
draw.text((106, 858), "FEATURED LISTINGS", font=font(11), fill=(153,126,78))
draw.text((106, 884), "Available properties", font=font(21, True), fill=navy)
draw.text((106, 920), "4 Bedroom Detached Duplex", font=font(14), fill=(49,51,54))
draw.text((106, 942), "Lekki Phase 1  ·  ₦185m", font=font(12), fill=(103,103,98))
draw.line((414, 881, 414, 949), fill=(228,225,217), width=1)
draw.text((446, 884), "3 Bedroom Serviced Apartment", font=font(14), fill=(49,51,54))
draw.text((446, 920), "Old Ikoyi  ·  ₦12m / yr", font=font(12), fill=(103,103,98))
draw.line((737, 881, 737, 949), fill=(228,225,217), width=1)
draw.text((768, 884), "4 Bedroom Terrace with BQ", font=font(14), fill=(49,51,54))
draw.text((768, 920), "Ajah  ·  ₦96.5m", font=font(12), fill=(103,103,98))
# Footer CTA / URL
draw.text((62, 1000), "Explore homes, rentals & land", font=font(17), fill=navy)
draw.text((1018, 1003), "brickwire-property.vercel.app", font=font(13), fill=(106,106,100), anchor="ra")
canvas.convert("RGB").save(OUT, quality=95)
print(OUT)
