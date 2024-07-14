import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import ProjectDetail from './views/ProjectDetail.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/:id', component: ProjectDetail },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router