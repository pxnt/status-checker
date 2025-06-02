import container from "../container.js";

export const emitPublicComponentGroupsUpdate = async ({ componentGroup, component }) => {
  try {
    const io = container.get('io');
    if (!io) {
      console.warn('Socket.IO instance not found in container');
      return;
    }

    // Emit the updated data to all clients in the public-updates room
    io.to('public-updates').emit('public-component-groups-updated', {
      componentGroup,
      component,
    });

    console.log('Emitted public component groups update');
  } catch (error) {
    console.error('Error emitting public component groups update:', error);
  }
};

export const emitPublicIncidentsUpdate = async ({ incident, action }) => {
  try {
    const io = container.get('io');
    if (!io) {
      console.warn('Socket.IO instance not found in container');
      return;
    }

    // Emit the updated data to all clients in the public-updates room
    io.to('public-updates').emit('public-incidents-updated', {
      incident,
      action,
    });

    console.log(`Emitted public incidents ${action} update for incident ID: ${incident?.id}`);
  } catch (error) {
    console.error('Error emitting public incidents update:', error);
  }
};