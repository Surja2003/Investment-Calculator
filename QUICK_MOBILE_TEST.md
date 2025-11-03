# Quick Mobile Test Guide

## Immediate Testing Steps

### 1. Start Development Server
```bash
npm run dev
```

### 2. Enable Mobile Simulator
- Look for **📱 Dev** button in top-right corner
- Click to open device simulator panel

### 3. Test Samsung Galaxy S24 FE
- Select "Samsung Galaxy S24 FE" from device presets
- Viewport will resize to 384×854px

### 4. Test Key Areas

#### SIP Calculator
- [ ] Monthly Investment input field
- [ ] Investment Duration (years) field  
- [ ] Expected Annual Return (%) field
- [ ] All input fields fit properly
- [ ] Labels (%, yrs) align correctly

#### Lumpsum Calculator  
- [ ] Initial Investment input field
- [ ] Investment Duration (years) field
- [ ] Expected Annual Return (%) field
- [ ] No layout overflow

#### SWP Calculator
- [ ] Withdrawal Rate (%) field
- [ ] Annual Withdrawal Amount field
- [ ] Expected Return (%) field  
- [ ] Withdrawal Period (years) field
- [ ] Inflation Rate (%) field

### 5. Check for Issues
- ❌ Input fields too wide (cramped layout)
- ❌ Input fields too narrow (hard to tap)
- ❌ Horizontal scrolling required
- ❌ Text too small to read
- ❌ Buttons overlap or too close

### 6. Fix and Test Cycle
1. Identify UI issue in simulator
2. Adjust CSS/styling in code
3. Save file (hot reload updates simulator)
4. Verify fix immediately
5. Test on other device sizes

## Current Target Sizes
- **Mobile Input Fields**: 80-100px width
- **Mobile Labels**: 28-36px width
- **Desktop**: 120-160px width (sm+ breakpoint)

## Quick Fixes Reference
```jsx
// Make input smaller for mobile
sx={{ width: { xs: 80, sm: 120 } }}

// Adjust label padding
sx={{ px: 1.5, fontSize: '0.875rem' }}

// Fix container overflow
sx={{ width: '100%', overflow: 'hidden' }}
```

---
*Use this guide for rapid mobile UI testing and fixes*