import { useState } from 'react';
import './ProjectBuilder.css';

interface Service {
	id: number;
	name: string;
	price: number;
}

interface ServiceItem {
	service: Service;
	quantity: number;
}

const availableServices: Service[] = [
	{ id: 1, name: 'Разработка лендинга', price: 50000 },
	{ id: 2, name: 'Интернет-магазин', price: 150000 },
	{ id: 3, name: 'Корпоративный портал', price: 300000 },
	{ id: 4, name: 'SEO-оптимизация', price: 20000 }
];

export default function ProjectBuilder() {
	const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
	const [selectedServiceId, setSelectedServiceId] = useState('');
	const [quantity, setQuantity] = useState<number>(1);

	let totalPrice = 0;
	for (const item of selectedServices) {
		totalPrice += item.service.price * item.quantity;
	}

	function addService() {
		const service = availableServices.find(s => String(s.id) === selectedServiceId);
		if (!service) return;

		setSelectedServices(prev => {
			const alreadyAdded = prev.some(item => item.service.id === service.id);
			if (!alreadyAdded) {
				return [...prev, { service, quantity }];
			}

			return prev.map(item =>
				item.service.id === service.id ? { ...item, quantity: item.quantity + quantity } : item
			);
		});
	}

	function removeService(serviceId: number) {
		setSelectedServices(prev => prev.filter(item => item.service.id !== serviceId));
	}

	return (
		<div className="project-builder">
			<h2>Состав проекта</h2>

			<div className="add-service">
				<select value={selectedServiceId} onChange={event => setSelectedServiceId(event.target.value)}>
					<option value="" disabled>
						Выберите услугу
					</option>
					{availableServices.map(service => (
						<option key={service.id} value={service.id}>
							{service.name} — {service.price.toLocaleString()} ₽
						</option>
					))}
				</select>

				<input
					type="number"
					min={1}
					max={10}
					value={quantity}
					onChange={event => setQuantity(Number(event.target.value))}
					className="service-count"
				/>

				<button onClick={addService} disabled={!selectedServiceId}>
					Добавить
				</button>
			</div>

			{selectedServices.length > 0 ? (
				<table className="services-table">
					<thead>
						<tr>
							<th>Услуга</th>
							<th>Цена за ед.</th>
							<th>Кол-во</th>
							<th>Сумма</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{selectedServices.map(item => (
							<tr key={item.service.id}>
								<td>{item.service.name}</td>
								<td>{item.service.price.toLocaleString()} ₽</td>
								<td>{item.quantity}</td>
								<td>{(item.service.price * item.quantity).toLocaleString()} ₽</td>
								<td>
									<button onClick={() => removeService(item.service.id)}>Удалить</button>
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={3}>
								<strong>Итого:</strong>
							</td>
							<td colSpan={2}>
								<strong>{totalPrice.toLocaleString()} ₽</strong>
							</td>
						</tr>
					</tfoot>
				</table>
			) : (
				<p className="empty-message">Пока не добавлено ни одной услуги</p>
			)}
		</div>
	);
}
