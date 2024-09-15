// lib/todo.js

import { supabase } from './supabaseClient';

// Fonction pour ajouter une tâche
export const addTask = async (userId, taskTitle) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      { user_id: userId, title: taskTitle }
    ]);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
