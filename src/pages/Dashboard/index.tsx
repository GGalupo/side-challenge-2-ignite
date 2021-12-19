import { useEffect, useState } from "react";

import api from "../../services/api";

import Header from "../../components/Header";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";

import { Food as IFood } from "../../types";

import { FoodsContainer } from "./styles";

const Dashboard = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);

  useEffect(() => {
    async function getFoods() {
      try {
        const response = await api.get("/foods");
        setFoods(response.data);
      } catch (e) {
        console.error(e);
      }
    }

    getFoods();
  }, []);

  const handleAddFood = async (food: IFood) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: IFood) => {
    try {
      const updatedFood = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const updatedFoods = foods.map((food) =>
        food.id !== updatedFood.data.id ? food : updatedFood.data
      );

      setFoods(updatedFoods);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    try {
      await api.delete(`/foods/${id}`);
    } catch (e) {
      console.error(e);
    }
    const filteredFoods = foods.filter((food) => food.id !== id);

    setFoods(filteredFoods);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: IFood) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
