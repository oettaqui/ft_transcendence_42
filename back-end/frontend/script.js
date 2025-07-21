// Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');
const loadingElement = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const filterButtons = document.querySelectorAll('.filter-btn');
// State
let todos = [];
let currentFilter = 'all';
let editingTodoId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    todoForm.addEventListener('submit', handleAddTodo);
    editForm.addEventListener('submit', handleEditTodo);
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            setActiveFilter(filter);
            renderTodos();
        });
    });
    
    // Modal events
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelEdit').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editModal.classList.contains('show')) {
            closeModal();
        }
    });
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showNotification('Error: ' + error.message, 'error');
        throw error;
    }
}

async function loadTodos() {
    try {
        showLoading(true);
        const response = await apiRequest('/todos');
        todos = response.data || [];
        renderTodos();
        updateStats();
    } catch (error) {
        console.error('Failed to load todos:', error);
    } finally {
        showLoading(false);
    }
}

async function createTodo(title, description) {
    const response = await apiRequest('/todos', {
        method: 'POST',
        body: JSON.stringify({ title, description })
    });
    return response.data;
}

async function updateTodo(id, updates) {
    const response = await apiRequest(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
    return response.data;
}

async function deleteTodo(id) {
    const response = await apiRequest(`/todos/${id}`, {
        method: 'DELETE'
    });
    return response;
}

// Event Handlers
async function handleAddTodo(e) {
    e.preventDefault();
    
    const title = document.getElementById('todoTitle').value.trim();
    const description = document.getElementById('todoDescription').value.trim();
    
    if (!title) return;
    
    try {
        const newTodo = await createTodo(title, description);
        todos.unshift(newTodo);
        renderTodos();
        updateStats();
        todoForm.reset();
        showNotification('Todo added successfully!', 'success');
    } catch (error) {
        console.error('Failed to add todo:', error);
    }
}

async function handleEditTodo(e) {
    e.preventDefault();
    
    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    
    if (!title || !editingTodoId) return;
    
    try {
        const updatedTodo = await updateTodo(editingTodoId, { title, description });
        const index = todos.findIndex(todo => todo.id === editingTodoId);
        if (index !== -1) {
            todos[index] = { ...todos[index], ...updatedTodo };
        }
        renderTodos();
        updateStats();
        closeModal();
        showNotification('Todo updated successfully!', 'success');
    } catch (error) {
        console.error('Failed to update todo:', error);
    }
}

async function handleToggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
        const updatedTodo = await updateTodo(id, { completed: !todo.completed });
        const index = todos.findIndex(t => t.id === id);
        if (index !== -1) {
            todos[index] = { ...todos[index], completed: !todo.completed };
        }
        renderTodos();
        updateStats();
        
        const message = todo.completed ? 'Todo marked as pending' : 'Todo completed!';
        showNotification(message, 'success');
    } catch (error) {
        console.error('Failed to toggle todo:', error);
    }
}

async function handleDeleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    
    try {
        await deleteTodo(id);
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
        updateStats();
        showNotification('Todo deleted successfully!', 'success');
    } catch (error) {
        console.error('Failed to delete todo:', error);
    }
}

function handleEditClick(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    editingTodoId = id;
    document.getElementById('editTitle').value = todo.title;
    document.getElementById('editDescription').value = todo.description || '';
    openModal();
}

// UI Functions
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    todoList.style.display = 'grid';
    emptyState.style.display = 'none';
    
    todoList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <div class="todo-header">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                     onclick="handleToggleTodo(${todo.id})"></div>
                <div class="todo-content">
                    <div class="todo-title">${escapeHtml(todo.title)}</div>
                    ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ''}
                </div>
            </div>
            <div class="todo-meta">
                <span class="todo-date">${formatDate(todo.created_at)}</span>
                <div class="todo-actions">
                    <button class="action-btn edit-btn" onclick="handleEditClick(${todo.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="handleDeleteTodo(${todo.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getFilteredTodos() {
    switch (currentFilter) {
        case 'completed':
            return todos.filter(todo => todo.completed);
        case 'pending':
            return todos.filter(todo => !todo.completed);
        default:
            return todos;
    }
}

function setActiveFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    document.getElementById('totalTodos').textContent = total;
    document.getElementById('completedTodos').textContent = completed;
    document.getElementById('pendingTodos').textContent = pending;
}

function showLoading(show) {
    loadingElement.style.display = show ? 'block' : 'none';
    todoList.style.display = show ? 'none' : 'grid';
}

function openModal() {
    editModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.getElementById('editTitle').focus();
}

function closeModal() {
    editModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    editingTodoId = null;
    editForm.reset();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        minWidth: '300px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#6c757d'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility Functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Today';
    } else if (diffDays === 2) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays - 1} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Handle network errors gracefully
window.addEventListener('online', () => {
    showNotification('Connection restored', 'success');
    loadTodos();
});

window.addEventListener('offline', () => {
    showNotification('No internet connection', 'error');
});