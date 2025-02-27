import { ref } from 'vue';
import { supabase } from './supabase';

export function useSupabase() {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);


  async function fetchData(tableName, columns = '*') {
    try {
      loading.value = true;
      const { data: result, error: fetchError } = await supabase
        .from(tableName)
        .select(columns);

      if (fetchError) throw fetchError;
      data.value = result;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // thêm dữ liệu
  async function insertData(tableName, payload) {
    try {
      loading.value = true;
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(payload);

      if (insertError) throw insertError;
      await fetchData(tableName); // Cập nhật lại dữ liệu sau khi thêm
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return { data, error, loading, fetchData, insertData };
}