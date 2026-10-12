# Pulse Workout PWA

A mobile-first workout planner for iPhone with a clean Apple-inspired interface, offline app shell, exercise illustrations, daily checklist, adjustable 30/45/60/75-minute sessions, six focus options, an expanded exercise library, progressive load guidance, history, and local data persistence.

## Run it
The service worker requires HTTPS or localhost. For the easiest free setup:
1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Open the published HTTPS URL in Safari on your iPhone.
5. Tap **Share → Add to Home Screen**.

You can also test it locally with a static server. Opening `index.html` directly works for basic use, but install/offline support requires HTTPS or localhost.

## Data & privacy
Profile, daily completion, and workout history are saved in this browser on this device using localStorage. They do not sync between devices and may be removed if Safari website data is cleared. Use **Progress → Export my data** to make a JSON backup after logging a workout.

## Important training notes
- Height and bodyweight are profile context; they are not used to guess lifting loads.
- Enter conservative starting loads you can control for the listed reps while leaving 2–3 reps in reserve.
- The progression rule is deliberately conservative: increase by the smallest available increment only after repeated successful sessions. Reduce or hold weight when reps or technique deteriorate.
- You can choose a 30, 45, 60, or 75-minute target and select a focus area (balanced, abs, back, shoulders, legs, or chest & arms). Each session retains a full-body base and adds movements for the selected focus.
- The app cannot guarantee a shredded physique in two months. Visible definition depends on starting body composition, nutrition, sleep, genetics, and consistent training. Avoid crash dieting; use a sustainable calorie deficit if fat loss is appropriate for you.
- Hard full-body resistance training every day is not ideal for everyone. Rotate effort, take rest days when fatigued or sore, and seek qualified advice if you have injuries or medical limitations.
- Illustrations are simplified visual guides, not a substitute for learning technique from a qualified coach.


## Updated beginner plan (v2)
- Four progressive dumbbell strength sessions per week, plus active recovery and a full rest day.
- Written for adjustable dumbbells up to 24 kg each and an adjustable bench.
- Focus options emphasise abs, back, shoulders, legs, or chest/arms without dropping balanced training.
- Training loads are user-entered; progression is conservative and capped at 24 kg per dumbbell when using kg units.
- Data is stored locally in this browser on this device. Export a JSON backup periodically; clearing browser data can erase the app's saved data.
- The app is a workout log and planning aid, not medical advice. Stop if you feel sharp pain, and ask a qualified professional if you have relevant health concerns.


## Real exercise demonstrations (v3)
- Exercise guides now try to load a matching animated GIF from the open-source ExerciseGymGifsDB static library hosted on jsDelivr.
- The guide includes numbered beginner steps and a video-search fallback if no exact GIF match is available.
- GIFs and video searches require an internet connection; once viewed, the browser may cache some media, but offline availability of every GIF is not guaranteed.
- Exercise GIF source: https://github.com/JahelCuadrado/ExerciseGymGifsDB (public project; see its repository for license and attribution details).
