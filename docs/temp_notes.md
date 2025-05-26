I want a different scrolling behavior when moving to the right with the arrow key:
-visually, the cards appear to be sliding to the left with a transition while the focus ring keeps its position (column 1) until the last card is completely on the screen
-when the last card is completely on the screen, the focus moves to right

to achieve that, i was thinking of this:
we can keep the current navigation but wrap the current swimlane into a wrapper component that will offset it so the currently focused card always appears at the same position as the first card (and we don't need to manage the focus ring position)

so we slide the swimlane to achieve the illusion that the cards are sliding until the last card is completely on the screen

when the last card is completely on the screen, the wrapper component stops offsetting the current swimlane

is that a pattern that can be achieved? just an assessment, no code yet

we have tried already, in other chats, to implement this scroll behavior but we never managed to proerly calculate the value of maxOffset

how can we make sure we calculate content width only after all its children have mounted? just an assessment

i am still working with static local cards but eventually, i will need the swimlane component to account for dynamic number of cards.
between 0 and 12 and more than 12:
-when the number of cards is low and content width is smaller than viewport width - left and right paddings (all card are completely visible within viewport width  - paddings), no offset of content is needed
-when the number of cards makes the width of content greater than the width of viewport', the current card sliding (content offset) is necessary until the right side of content is at 60px from the right edge of viewport
-when there are more than card than a settable fixed number (12 for now), only the fixed number of cards are displayed in the swimlane, then a special "More" card is appended at the end of the swimlane (after the 12 cards).
-clicking the More card brings up a grid view screen with all the cards


---------

focus and offset restoration:
the current swimlane keyboard navigation for this tv app prototype works fine and I don't want to change it;
that being said, when I navigate to another screen and back; there is a bug:
if users select channel 1, go to channel info and them back to home, all is good
if users selct any other card to navigate to channel info, when they go back to home, the proper channel is focused (last selected) but the animation is triggered again; i would rather have the swimlane appear with the last selected channel already focused at its proper position

The problem aggravates when users navigate to a card that was off the right side of the screen to focus and select it to go to its corresponding channel info. when they go back to the home screen, the content offset is wrong and even though the proper card is probably focused, they don't see it because it off the left side of the screen (and swimlane-content is offset further than its limit of --screen-side-padding (100px) from the right side of swimlane-viewport)

i would like to find the simplest way to go back to the home screen without users seeing any content offset sliding; just the same state as home was when they clicked on a card.

can we "record" that state (x position of swimlane-content) easily to properly restore it without any transition animation?

no code yet, just an assessment

---

1. State Storage:
{
  contentOffset: string,  // the transform value
  isRestoring: boolean    // flag to indicate we're in restoration mode
}
2. Capture State:
Before navigation:
Get current transform value
Save it with isRestoring: false
Let spatial navigation proceed as normal
3. State Restoration:
On return:
Set isRestoring: true
Apply saved transform value to swimlane-content
Temporarily disable transitions
Let spatial navigation restore focus
After focus is restored, set isRestoring: false
4. Offset Prevention:
Modify the offset calculation logic to check isRestoring:
If isRestoring is true:
Skip the normal offset calculation
Keep the manually set transform value
If isRestoring is false:
Proceed with normal offset behavior
This ensures that:
Spatial navigation can restore focus normally
The focus restoration won't trigger unwanted offset changes
Once restoration is complete, normal offset behavior resumes
We maintain the exact position users last saw