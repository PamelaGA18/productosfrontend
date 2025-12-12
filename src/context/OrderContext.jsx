import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
    createOrderRequest,
    updateStatsOrderRequest,
    getOrdersRequest,
    getUserOrderRequest,
    getOrderByidRequest,
    deleteOrderRequest
} from '../api/orders';
import { toast } from 'react-toastify';

const OrderContext = createContext();

export const useOrders = () => {
    const context = useContext(OrderContext);

    if (!context)
        throw new Error("Orders debe estar en un contexto")

    return context;
}; //Fin de useOrders

export function OrdersProvider({ children }) {
    const { isAdmin } = useAuth();
    const [orders, setOrders] = useState([]);
    const [errors, setErrors] = useState([]);

    //Función para obtener todas las ordenes de la base de datos
const getOrders = async () => {
    let res = []
    try {
        if (isAdmin)
            res = await getOrdersRequest();
        else
            res = await getUserOrderRequest();
            
        setOrders(res.data);
    } catch (error) {
        toast.error("Error al obtener las ordenes");
        setErrors(error.response.data.message);
    }
}; //Fin de getOrders

//Función para crear una orden
const createOrder = async (order)=>{
    try {
        await createOrderRequest(order);
        await getOrders();
        toast.success("Orden creada con éxito");
    } catch (error) {
        toast.error("Error al crear la orden");
        setErrors(error.response.data.message);
    }
}; //Fin de createOrder

//Función para actualizar el status de una orden
const updateStatusOrder = async (id, status) => {
    try {
        await updateStatsOrderRequest(id, status);
        await getOrders();
        toast.success("Estado de la orden actualizado con éxito" + status.status);
    } catch (error) {
        toast.error("Error al actualizar el estado de la orden");
        setErrors(error.response.data.message);
    }
}; //Fin de updateStatusOrder

//Función para obtener una orden por Id
const getOrderByID = async ( id ) =>{
    try {
        const res = await getOrderByidRequest(id);
        return res.data;
    } catch (error) {
        toast.error("Error al obtener la orden ID");
        setErrors(error.response.data.message);
    }
}; //Fin de getOrderById

//Función para eliminar una orden
const deleteOrder = async ( id ) =>{
    try {
        await deleteOrderRequest(id);
        await getOrders();
        toast.success("Orden eliminada con éxito");
    } catch (error) {
        toast.error("Error al eliminar la orden");
        setErrors(error.response.data.message);
    }
}; //Fin de deleteOrder

//Use effect que vacía el arreglo de errores pasados 5 segundos
useEffect (()=>{
    if (errors.length > 0){
        const timer = setTimeout (()=>{
            setErrors([])
        }, 5000)
        return ()=> clearTimeout(timer);
    }//Fin de if
}, [errors]); //Fin de useEffect

    return (
        <OrderContext.Provider value={{
            orders,
            errors,
            getOrders,
            createOrder,
            updateStatusOrder,
            getOrderByID,
            deleteOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
}; //Fin de OrdersProvider