// @flow

import getEventOffset from './get-event-offset';

const getEventsDiff = (event1, event2) => ({
  offsetX: getEventOffset(event1).offsetX - getEventOffset(event2).offsetX,
  offsetY: getEventOffset(event1).offsetY - getEventOffset(event2).offsetY,
});

export default (params: Object, context: Object) => (eventMove: Object) => {
  const { listeners } = params;
  const { onMove } = listeners;
  const { eventStart, eventMovePrev, stateStart } = context;
  const ctx = context;

  if (eventStart && eventMovePrev && onMove) {
    const eventDiffPrev = getEventsDiff(eventMove, eventMovePrev);

    if (eventDiffPrev.offsetX !== 0 || eventDiffPrev.offsetY !== 0) {
      ctx.status = 'move';

      onMove({
        eventDiff: getEventsDiff(eventMove, eventMovePrev),
        eventStart,
        eventMove,
        stateStart,
        eventDiffPrev,
      });
    }
  }
};
