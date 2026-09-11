(() => {
  const socket = io();

  function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function addServiceCard(service) {
    const list = document.querySelector('#services-list');
    if (!list || document.querySelector(`[data-service-id="${service.id}"]`)) return;

    const emptyState = list.querySelector('.empty-state');
    emptyState?.remove();

    const card = document.createElement('article');
    card.className = 'service-card service-card--new';
    card.dataset.serviceId = service.id;

    const topline = document.createElement('div');
    topline.className = 'service-card__topline';
    topline.append(createTextElement('span', 'tag', service.category));
    topline.append(
      createTextElement(
        'span',
        service.available ? 'status status--available' : 'status status--unavailable',
        service.available ? 'Disponible' : 'No disponible'
      )
    );

    card.append(topline);
    card.append(createTextElement('h2', '', service.name));
    card.append(createTextElement('p', '', service.description));

    const meta = document.createElement('dl');
    meta.className = 'service-meta';
    const duration = document.createElement('div');
    duration.append(createTextElement('dt', '', 'Duración'));
    duration.append(createTextElement('dd', '', `${service.duration} min`));
    const price = document.createElement('div');
    price.append(createTextElement('dt', '', 'Precio'));
    price.append(createTextElement('dd', '', `$${service.price}`));
    meta.append(duration, price);
    card.append(meta);
    list.prepend(card);
  }

  socket.on('service:created', addServiceCard);
})();