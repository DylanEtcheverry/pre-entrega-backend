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
    card.append(
      createTextElement(
        'p',
        'professional',
        `A cargo de ${service.professionalName || 'Sin asignar'}`
      )
    );
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
    card.append(createDeleteButton(service.id));
    list.prepend(card);
  }

  function createDeleteButton(serviceId) {
    const button = createTextElement('button', 'delete-service', 'Eliminar servicio');
    button.type = 'button';
    button.dataset.serviceId = serviceId;
    return button;
  }

  async function deleteService(serviceId, button) {
    if (!window.confirm('¿Eliminar este servicio?')) return;

    button.disabled = true;
    const response = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
    if (!response.ok) {
      button.disabled = false;
      return;
    }
  }

  const form = document.querySelector('#service-form');
  const formStatus = document.querySelector('#service-form-status');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    formStatus.textContent = 'Guardando servicio...';

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      professionalName: formData.get('professionalName'),
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
      category: formData.get('category'),
      description: formData.get('description'),
      available: formData.get('available') === 'on',
    };

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo crear el servicio');

      form.reset();
      form.querySelector('[name="available"]').checked = true;
      formStatus.textContent = 'Servicio agregado. La lista se actualizará en tiempo real.';
    } catch (error) {
      formStatus.textContent = error.message;
    }
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.delete-service');
    if (button) deleteService(button.dataset.serviceId, button);
  });

  socket.on('service:created', addServiceCard);
  socket.on('service:deleted', ({ id }) => {
    document.querySelector(`[data-service-id="${id}"]`)?.remove();
  });
})();