#!/usr/bin/env python3
"""
AEON RAILGUARD - Environment Setup Script
Creates the required directory structure for AI training and inference.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.resolve()

DIRECTORIES = [
    BASE_DIR / "datasets" / "raw_images",
    BASE_DIR / "datasets" / "videos",
    BASE_DIR / "datasets" / "sorted_data",
    BASE_DIR / "inference" / "output",
    BASE_DIR / "models",
]

def setup_environment():
    print("")
    print("=" * 60)
    print("  AEON RAILGUARD - ENVIRONMENT SETUP")
    print("=" * 60)
    print("")
    
    for directory in DIRECTORIES:
        if not directory.exists():
            directory.mkdir(parents=True, exist_ok=True)
            print(f"  [CREATED] {directory.relative_to(BASE_DIR)}")
        else:
            print(f"  [EXISTS]  {directory.relative_to(BASE_DIR)}")
    
    print("")
    print("=" * 60)
    print("  MISSION BRIEF")
    print("=" * 60)
    print("")
    print("  SYSTEM READY. Download dataset dari Google Drive:")
    print("  https://drive.google.com/drive/folders/1ORK_rs61H6-Bvjnoo3fjQgpnP0WlgIPf")
    print("")
    print("  Letakkan file di:")
    print("   -> PHOTOS: ai-engine/datasets/sorted_data/")
    print("   -> VIDEOS: ai-engine/datasets/videos/")
    print("")
    print("=" * 60)

if __name__ == "__main__":
    setup_environment()
