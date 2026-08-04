# Tip markers

Inactive steps whose targets are on-screen can show small tip markers so users can jump ahead.

## Options

| Option | Default | Meaning |
|--------|---------|---------|
| `disableTips` | `false` | Skip the tip layer entirely (cheapest) |
| `tipOrientationPreferences` | east/south/… | Preferred sides for markers |

## Placement rules

Tips avoid:

1. The active spotlight hole (target + `maskPadding`)
2. The open tooltip chrome  
3. Other tip markers  
4. Neighboring tip targets  

If no clear slot exists, that tip is **hidden** rather than drawn over the tour.

## Performance

- No polling interval by default  
- Scroll/resize coalesced to one animation frame  
- Cap on how many tips render at once  
- `disableTips: true` removes the layer completely  

Markers are `position: fixed` in viewport space, same portal as the mask/tooltip.
