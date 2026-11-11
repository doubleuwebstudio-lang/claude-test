"""ATELIER ON 사진 색감 통일 스크립트.

images/original/*.jpg 를 읽어 같은 기준으로 보정한 뒤 images/*.jpg 로 저장합니다.
1) 벽·천장처럼 밝고 채도가 낮은 부분을 같은 따뜻한 흰색으로 맞춥니다 (우드 색은 그대로 둠).
2) 검은 점·흰 점과 평균 밝기를 같은 기준으로 맞춥니다.
3) 채도를 조금 낮추고 그림자를 살짝 띄워 부드럽게 맞춥니다.
사용법: python3 tools/grade.py   (atelier-on 폴더에서)
"""
import glob, os
import numpy as np
from PIL import Image

WALL_WHITE = np.array([1.03, 1.0, 0.94])  # 목표 벽 색 비율 (R:G:B), 약간 따뜻한 흰색
WB_STRENGTH = 0.85      # 화이트밸런스 보정 강도
TARGET_MEAN = 0.58      # 목표 평균 밝기
BLACK, WHITE = 0.06, 0.96  # 출력 검은 점(살짝 띄움)·흰 점
SATURATION = 0.8

def grade(a):
    L = a @ np.array([0.2126, 0.7152, 0.0722])
    mx, mn = a.max(2), a.min(2)
    sat = (mx - mn) / np.maximum(mx, 1e-4)
    for lmin, smax in ((0.6, 0.10), (0.5, 0.16), (0.4, 0.22)):
        m = (L > lmin) & (sat < smax) & (L < 0.99)
        if m.sum() > 2000:
            break
    wall = a[m].mean(0)
    gains = WALL_WHITE / (wall / wall[1])
    gains = 1 + (gains - 1) * WB_STRENGTH
    a = np.clip(a * gains, 0, 1)

    L = a @ np.array([0.2126, 0.7152, 0.0722])
    bp, wp = np.percentile(L, 0.5), np.percentile(L, 99.7)
    a = np.clip((a - bp) / max(wp - bp, 1e-3), 0, 1)

    L = a @ np.array([0.2126, 0.7152, 0.0722])
    g = np.clip(np.log(TARGET_MEAN) / np.log(max(L.mean(), 1e-3)), 0.7, 1.3)
    g = 1 + (g - 1) * 0.75
    a = a ** g

    L = (a @ np.array([0.2126, 0.7152, 0.0722]))[..., None]
    a = L + (a - L) * SATURATION
    return np.clip(BLACK + a * (WHITE - BLACK), 0, 1)

def trim_edges(a, limit=10, diff=0.12):
    """원본 가장자리에 붙은 어두운·밝은 띠(몇 픽셀)를 잘라 냅니다."""
    L = a.mean(2)
    t = b = l = r = 0
    while t < limit and abs(L[t].mean() - L[limit + 2].mean()) > diff: t += 1
    while b < limit and abs(L[-1 - b].mean() - L[-limit - 3].mean()) > diff: b += 1
    while l < limit and abs(L[:, l].mean() - L[:, limit + 2].mean()) > diff: l += 1
    while r < limit and abs(L[:, -1 - r].mean() - L[:, -limit - 3].mean()) > diff: r += 1
    return a[t:a.shape[0] - b, l:a.shape[1] - r], (t, b, l, r)

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    src = os.path.join(here, "..", "images", "original")
    for f in sorted(glob.glob(os.path.join(src, "*.jpg"))):
        im = Image.open(f).convert("RGB")
        arr, cut = trim_edges(np.asarray(im).astype(np.float32) / 255)
        if any(cut):
            print("  가장자리 띠 제거 (위, 아래, 왼쪽, 오른쪽 px):", cut)
        out = grade(arr)
        Image.fromarray((out * 255 + 0.5).astype(np.uint8)).save(
            os.path.join(src, "..", os.path.basename(f)), quality=84, optimize=True, progressive=True)
        print("graded", os.path.basename(f))
