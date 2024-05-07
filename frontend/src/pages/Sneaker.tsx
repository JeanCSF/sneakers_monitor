import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sneakers } from "../utils/types";
export const Sneaker: React.FC = () => {
    const { id } = useParams();

    const [sneaker, setSneaker] = useState<Sneakers | null>(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/sneaker/${id}`)
            .then(response => {
                setSneaker(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [id]);
    return (
        <div>
            {sneaker && (
                <div>
                    <h1>{sneaker.sneakerTitle}</h1>
                    <img src={sneaker.img} alt={sneaker.sneakerTitle} />
                </div>
            )}
        </div>
    );
}