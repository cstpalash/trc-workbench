# Updated Layout Structure for AddEventModal

## Before the Change
The "Assign Team Members" section was embedded within the Event Details grid as the 4th column item, making it cramped and less prominent.

```
Event Details Section
├── Grid: 2 columns × 2 rows
│   ├── Event Type      ├── Priority
│   ├── Status          ├── Assign Team Members (cramped in grid cell)
```

## After the Change ✅
The "Assign Team Members" section now has its own dedicated section, starting from a new line with proper spacing and prominence.

```
Event Details Section
├── Grid: 2 columns × 2 rows  
│   ├── Event Type      ├── Priority
│   └── Status          └── (empty/available for future fields)

Team Assignment Section (NEW DEDICATED SECTION)
├── Section Header: "Assign Team Members" with UserIcon
├── Grid: 2 columns (responsive)
│   ├── TRC Section     ├── PSL Section
│   └── Product Lead    └── AO Section
```

## Benefits of the New Layout

### 1. **Better Visual Hierarchy**
- Clear section separation with dedicated heading
- Proper spacing between different form sections
- More prominent placement for team assignment

### 2. **Improved Usability**
- More space for team member cards
- Better grid alignment for persona sections
- Cleaner form flow from top to bottom

### 3. **Enhanced Responsiveness**
- Team assignment section can utilize full modal width
- Better mobile experience with dedicated space
- Flexible grid that adapts to content

### 4. **Future-Proof Design**
- Room for additional fields in Event Details grid
- Dedicated space for team assignment enhancements
- Scalable section-based architecture

## Form Section Order (Top to Bottom)

1. **Basic Information**
   - Event Title
   - Description

2. **Entity Association** 
   - Entity Type
   - Select Entity

3. **Event Details**
   - Event Type, Priority
   - Status, (available slot)

4. **Team Assignment** ← NEW DEDICATED SECTION
   - TRC, PSL, Product Lead, AO sections

5. **Schedule**
   - Start Date & Time
   - End Date & Time