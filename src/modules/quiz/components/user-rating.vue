<template>
  <data-table
    :value="rating"
    :pt="ptTable"
    class="tw-w-full"
  >
    <column
      v-for="(item, index) in columns"
      :key="index"
      :field="item.field"
      :header="item.header"
    />
  </data-table>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { toRefs, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'user-rating',
  components: {
    DataTable,
    Column
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  setup (props) {
    const { id } = toRefs(props)
    const store = useStore()

    onMounted(async () => {
      await store.dispatch('quiz/getUserRating', id.value)
    })

    const rating = computed(() => store.state.quiz.rating)
    const columns = [
      { field: 'username', header: 'Пользователь' },
      { field: 'time', header: 'Время прохождения' },
      { field: 'points', header: 'Правильные ответы' }
    ]
    const ptTable = {
      thead: {
        class: 'tw-border-b tw-border-middle-gray'
      }
    }

    return {
      columns,
      ptTable,
      rating
    }
  }
}
</script>
