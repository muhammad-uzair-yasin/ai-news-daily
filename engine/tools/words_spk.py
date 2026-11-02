#!/usr/bin/env python3
"""sents.json (from engine/tts/narrate.py: [[phrase, start_s, end_s, speaker], ...]) -> words.ts with WORDS/CHUNKS/TOTAL/ENV + SPK.
usage: python3 engine/tools/words_spk.py episodes/<ep>
"""
import json, os, subprocess, sys, tempfile
ep = sys.argv[1].rstrip('/')
here = os.path.dirname(os.path.abspath(__file__))
s = json.load(open(os.path.join(ep, 'sents.json')))
tmp = tempfile.NamedTemporaryFile('w', suffix='.json', delete=False); json.dump([x[:3] for x in s], tmp); tmp.close()
subprocess.run([sys.executable, os.path.join(here, '..', 'gen_words.py'), tmp.name, os.path.join(ep, 'narration.mp3'), os.path.join(ep, 'words.ts')], check=True)
spk = [[15 + round(a * 30), 15 + round(b * 30), w] for _, a, b, w in s]
open(os.path.join(ep, 'words.ts'), 'a').write('export const SPK: [number, number, string][] = ' + json.dumps(spk) + ';\n')
os.unlink(tmp.name); print('words.ts written with SPK,', len(spk), 'phrases')
