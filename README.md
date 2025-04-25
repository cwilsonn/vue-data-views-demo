# Vue 3 Data Views Demo

This demo showcases a flexible, composable data view system built with **Vue 3**, **TypeScript**, and **TailwindCSS**.  
It features reusable UI patterns and composables for search, sort, filter, and pagination — rendered across multiple layout types including a table and card list.

> 🛠️ Designed as a technical portfolio piece to demonstrate modern frontend architecture, component design, and developer experience.

---

## ✨ Features

- 🔍 **Search, Filter, Sort, and Pagination** via reusable composables
- 🧩 **Highly customizable** slots for cells, headers, rows, and filters
- 🗃️ **Multiple data views**:
- 🧠 **Type-safe configuration** using generics
- 💡 **Vue best practices**:
  - `<script setup>` + `defineModel`
  - Composition API + modular composables
  - Accessibility-first form design
- ⚡ Built with Vite + TailwindCSS

---

## 🧰 Stack

- **Vue 3 + `<script setup>`**
- **Vue Router**
- **TypeScript**
- **TailwindCSS + DaisyUI**
- **@vueuse/core**
- **@vuepic/vue-datepicker**
- **@iconify/vue**
- **@evomark/vue-forward-slots**

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/cwilsonn/vue-data-views-demo.git
cd vue-data-views-demo

# Install dependencies
npm install

# Run dev server
npm run dev
```

App will be available at `http://localhost:5173`.

---

## 🧪 Test Data

All views use a shared task dataset based on the following flattened schema:

```ts
type TaskDataFlattened = {
  id: number
  title: string
  description: string
  status: 'todo' | 'inProgress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate: string // YYYY-MM-DD
  createdAt: string
  updatedAt: string
  assigneeId: number
  assigneeName: string
  assigneeEmail: string
  assigneeIsActive: boolean
  tags: string[]
}
```

---

## 📌 Notes

- `defineModel` default behavior is enhanced using a `useHydratedModel()` composable to support reactive defaults without requiring v-model binding.
- There are future plans to allow for non-flattened data schemas via dot-notation based property access in applicable components and associated logic. This bypassed for the MVP release of this demo due to the complexities of the types with this pattern.

---

## 🤝 License

MIT — use freely as inspiration or foundation for your own projects.

---

## 🧑‍💻 Author

**Cody Wilson**  
Senior Frontend Engineer  
[LinkedIn](https://www.linkedin.com/in/cody-wilson-764b77191/)
