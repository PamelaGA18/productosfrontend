import CartResume from "../components/CartResume";
import AddAddress from "../components/AddAddress";
import AddPayment from "../components/AddPayment";
import { useProducts } from "../context/ProductContext";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { toast } from "react-toastify";

function SalesPage() {
  const navigate = useNavigate();
  const {
    address,
    payment,
    cart,
    updateStepOrder,
    initOrder,
    stepOrder,
    clearCart,
    getTotalProducts,
    calculateSubTotal,
    calculateIva,
    calculateTotal,
  } = useProducts();
  const { createOrder } = useOrders();
  const isProcesing = useRef(false);

  const steps = [
    "Confirmar Pedido",
    "Agregar direccion",
    "Informacion de pago",
    "Finalizar",
  ];

  //Use effect que se ejecuta una sola vez
  //al inicializar el componente
  useEffect(() => {
    if (stepOrder === 0) navigate("/getallproducts");
    initOrder();
  }, []); //Fin de useEffect

  //UseEffect para finalizar la venta cuando stepOrder es 4
  useEffect(() => {
    if (stepOrder === 4) {
      finalizingSale();
    }
  }, [stepOrder]);

  const finalizingSale = () => {

    if(isProcesing.current) {
        return;
    }
    isProcesing.current = true;

    //Crear el pedido
    let paymentData = {};
    if (payment.paymentMethod === "card") {
      paymentData = {
        method: payment.paymentMethod,
        cardDetails: payment.cardDetails,
        shippingAddress: address,
      }
    } else 
      paymentData = {
        method: payment.paymentMethod,
        userName: payment.userName,
      }
    const orderData = {
      items: cart.map((item) => ({
        productId: item._id,
        quantity: item.toSell.toFixed(0),
        price: item.price.toFixed(2),
      })),
      paymentMethod: paymentData,
      totalProducts: getTotalProducts().toFixed(0),
      subTotal: calculateSubTotal.toFixed(2),
      total: calculateTotal.toFixed(2),
      iva: calculateIva(calculateSubTotal).toFixed(2),
      status: "received",
    };

    //creamos la orden mandando los datos al api
    createOrder(orderData);

    //Reiniciamos el proceso del pedido al paso 0
    updateStepOrder(0);

    //vaciamos el carrito
    clearCart();

    //enviamos notificacion de orden creada
    toast.success("pedido procesado correctamente   ");

    //reset despues de un segundo
    setTimeout(() => {
        isProcesing.current = false;
    }, 1000);

    //navegamos hacia el listado de productos
    navigate("/getallproducts");
  }; //Fin de finalizingSale

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white
                    ${stepOrder >= index + 1 ? "bg-blue-500" : "bg-gray-300"}
                    `}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`absolute w-full h-1
                            ${
                              stepOrder > index + 1
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            } 
                        `}
                  style={{ left: "10%", transform: "translateX(50%)" }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-4">
        {stepOrder === 1 && <CartResume />}
        {stepOrder === 2 && <AddPayment />}
        {stepOrder === 3 && <AddAddress />}
        {stepOrder === 4 && <div className="text-center p-8">Procesando pedido...</div>}
      </div>
    </div>
  );
}

export default SalesPage;
