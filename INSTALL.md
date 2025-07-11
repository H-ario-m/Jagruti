# Quick Installation Guide - Universal Video Skip Buttons

## ⚡ 5-Minute Setup

### Step 1: Download Extension
Save all files in this folder to your computer.

### Step 2: Open Chrome Extensions
1. Open Chrome browser
2. Type `chrome://extensions/` in the address bar
3. Press Enter

### Step 3: Enable Developer Mode
- Look for "Developer mode" toggle in the top-right
- Turn it **ON** (it will turn blue)

### Step 4: Load Extension
1. Click **"Load unpacked"** button (top-left area)
2. Browse to and select the `universal-video-skip-buttons` folder
3. Click "Select Folder"

### Step 5: Grant Permissions
- Chrome will ask to access all websites (required for universal detection)
- Click "Allow" or "Accept"

### Step 6: Test It!

Try these popular platforms:

**YouTube**
- https://www.youtube.com/watch?v=dQw4w9WgXcQ
- Look for ⏪ ⏩ buttons next to play button

**Vimeo**
- https://vimeo.com/
- Find any video, buttons in control bar

**Twitter/X**
- https://twitter.com/
- Find a video tweet, hover to see overlay buttons

**Any news site with video**
- CNN, BBC, etc.
- Buttons appear as overlay on bottom-left

## 🎯 What You Should See

### Integrated Mode (YouTube, Vimeo, Netflix, Twitch)
```
[▶️ Play] [⏪ 10] [⏩ 10] [🔊 Volume] [⚙️ Settings]
```
- Buttons appear IN the control bar
- Match platform styling
- Fade with other controls

### Overlay Mode (Generic Sites)
```
Video Player
┌────────────────────────┐
│                        │
│                        │
│   [⏪]  [⏩]           │  ← Bottom-left corner
└────────────────────────┘
```
- Floating buttons over video
- Semi-transparent
- Auto-hide after 3 seconds

## ✅ Success Checklist

- [ ] Extension appears in `chrome://extensions/` with no errors
- [ ] Extension is toggled ON (blue switch)
- [ ] Buttons appear on YouTube videos
- [ ] Clicking ⏪ skips back 10 seconds
- [ ] Clicking ⏩ skips forward 10 seconds
- [ ] Buttons work on multiple websites

## 🔧 Testing Different Platforms

### Test 1: YouTube (Integrated)
1. Go to any YouTube video
2. Look at bottom-left of player controls
3. Should see ⏪ and ⏩ next to play button
4. **Expected**: Native-looking buttons

### Test 2: Twitter/X (Overlay)
1. Find any video tweet
2. Hover mouse over video
3. Look at bottom-left corner
4. **Expected**: Floating circular buttons

### Test 3: Generic Site (Overlay)
1. Visit any news site with video (CNN, BBC, etc.)
2. Play a video
3. Move mouse over video
4. **Expected**: Semi-transparent buttons bottom-left

## 🚨 Troubleshooting

### "Buttons don't appear"

**Problem**: No buttons visible on videos
**Solutions**:
1. Refresh the page (F5)
2. Wait for video to fully load
3. Check if video is > 200x100 pixels (tiny previews excluded)
4. Open DevTools (F12) and check for JavaScript errors

### "Permission warning"

**Problem**: Chrome warns about "access all websites"
**Explanation**: This is REQUIRED for universal video detection
**Why**: Extension needs to scan any page for video players
**Privacy**: Extension does NOT collect or transmit any data

### "Buttons overlap controls"

**Problem**: Buttons block other player controls
**Solution**: 
1. Open `styles.css`
2. Find `.uvs-skip-buttons-container`
3. Adjust `margin` values
4. Reload extension

### "Extension causes lag"

**Problem**: Browser feels slow after installing
**Unlikely**: Extension is extremely lightweight
**Check**: 
1. Open `chrome://extensions/`
2. Look at "Inspect views: background page"
3. Check memory usage (should be < 2 MB)
4. If issue persists, disable and report the specific website

### "Buttons don't skip on specific site"

**Problem**: Clicking buttons does nothing
**Causes**:
1. DRM-protected content (Netflix, some Hulu)
2. Custom player that blocks standard controls
3. Live stream without DVR
**Workaround**: Use keyboard arrows (Left/Right)

## 📱 Mobile/Tablet Support

**Chrome on Android**: ⚠️ Limited support
- Chrome extensions not fully supported on mobile Chrome
- Consider using Kiwi Browser (supports Chrome extensions)

**iPad/Safari**: ❌ Not compatible
- Chrome extensions don't work on iOS

## 🔒 Security & Privacy

**What extension can access:**
✅ HTML `<video>` elements on web pages
✅ DOM structure to find controls
✅ Video playback state (currentTime, duration)

**What extension CANNOT access:**
❌ Your passwords
❌ Your browsing history
❌ Your personal data
❌ Other tabs or windows
❌ Network traffic

**Data collection**: ZERO
- No analytics
- No tracking
- No external servers
- All processing local

## 💡 Pro Tips

1. **YouTube**: Right-click extension icon → "Pin" to keep visible
2. **Quick disable**: Click extension icon → toggle off (if needed)
3. **Custom duration**: Edit `content.js` to change from 10 seconds
4. **Keyboard backup**: Arrow keys still work as alternative
5. **Multiple videos**: Extension works on pages with multiple videos

## 🎓 Understanding the Two Modes

### Mode 1: Integrated (Smart Platforms)
**Platforms**: YouTube, Vimeo, Netflix, Twitch
**Behavior**: Buttons inserted into native controls
**Styling**: Matches platform design
**Visibility**: Syncs with platform control fade

### Mode 2: Overlay (Generic Sites)
**Platforms**: News sites, blogs, forums, etc.
**Behavior**: Floating buttons over video
**Styling**: Semi-transparent, universal design
**Visibility**: Shows on hover, hides after 3s idle

## 🆘 Still Having Issues?

1. **Check browser version**: Chrome 88+ required
2. **Disable conflicting extensions**: Try disabling other video extensions
3. **Clear browser cache**: Sometimes helps with conflicts
4. **Reinstall**: Remove and reload the extension
5. **Check console**: F12 → Console tab → look for red errors

## 📊 What's Next?

After successful installation:
1. Browse your favorite video sites
2. Notice buttons appear automatically
3. Enjoy quick 10-second skips
4. Customize if desired (see README.md)

---

## Quick Reference Card

| Platform | Button Location | Style |
|----------|----------------|-------|
| YouTube | Next to play button | Native YT style |
| Vimeo | Control bar left | Vimeo style |
| Netflix | Control row | Netflix style |
| Twitch | Left controls | Twitch purple |
| Twitter | Overlay bottom-left | Circular |
| Reddit | Overlay bottom-left | Square |
| Others | Overlay bottom-left | Semi-transparent |

**Keyboard Shortcuts**: Still work!
- `←` Left Arrow = -10 seconds
- `→` Right Arrow = +10 seconds

**Extension works on**: HTML5 `<video>` elements anywhere

---

**Installation Time**: ~5 minutes  
**Compatibility**: All video sites  
**Performance Impact**: Negligible  
**Privacy**: Zero data collection
