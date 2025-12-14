import OrderStatus from './OrderStatus';

function OrderInfo({id, quantity, subtotal, iva, total, status, orderDate}) {

    // Función para formatear la fecha de manera amigable
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

   return (
    <div className="space-y-4 p-4 bg-white shadow-lg py-2 rounded-md text-gray-950 text-xs">
        <div className="flex justify-between">
            <span className="font-semibold">ID del Pedido:</span>
            <span>{id}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold">Estatus del pedido:</span>
            <OrderStatus status={status} />
        </div>
        <div className="flex justify-between">
            <span className="font-semibold">Cantidad de Productos:</span>
            <span>{quantity}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold">Subtotal:</span>
            <span>${subtotal?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold">IVA:</span>
            <span>${iva?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold">Total:</span>
            <span>${total?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold">Fecha del pedido:</span>
            <span>{formatDate(orderDate)}</span>
        </div>
    </div>
 )
}

export default OrderInfo