<template>
    <section class="container">
        <h1>Prueba API Colchones</h1>
       
        <!-- 1) GET /getallcolchones -->
        <div class="card">
            <div class="header">
                <h2>Catálogo de colchones</h2>
                <button type="button" :disabled="loadingColchones" @click="getAllColchones">
                    {{ loadingColchones ? 'Cargando...' : 'Cargar colchones' }}
                </button>
            </div>

            <p v-if="errorColchones" class="msg error">{{ errorColchones }}</p>
            <p v-else-if="colchonesCargados && !colchones.length">No hay colchones registrados.</p>

            <table v-if="colchones.length">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Imagen</th>
                        <th>Precio</th>
                        <th>Medidas</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in colchones" :key="c.id">
                        <td>{{ c.id }}</td>
                        <td>{{ c.nombre }}</td>
                        <td>{{ c.imagen }}</td>
                        <td>{{ c.precio }}</td>
                        <td>{{ c.medidas }}</td>
                        <td>
                            <button type="button" class="small" @click="formCompra.id_colchon = c.id">Usar ID</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 2) POST /buycolchon -->
        <form class="card" @submit.prevent="buyColchon">
            <h2>Comprar colchón</h2>

            <label>
                ID del colchón
                <input v-model="formCompra.id_colchon" type="text" inputmode="numeric" required />
            </label>

            <label>
                Documento del cliente
                <input v-model="formCompra.documento_cliente" type="text" inputmode="numeric" required />
            </label>

            <button type="submit" :disabled="buying">
                {{ buying ? 'Enviando...' : 'Comprar' }}
            </button>

            <p v-if="errorCompra" class="msg error">{{ errorCompra }}</p>
            <p v-if="mensajeCompra" class="msg ok">{{ mensajeCompra }}</p>
        </form>

        <!-- 3) GET /getcolchonescomprados -->
        <form class="card" @submit.prevent="getColchonesComprados">
            <h2>Colchones comprados por un cliente</h2>

            <label>
                Documento del cliente
                <input v-model="documentoConsulta" type="text" inputmode="numeric" required />
            </label>

            <button type="submit" :disabled="loadingComprados">
                {{ loadingComprados ? 'Consultando...' : 'Consultar' }}
            </button>

            <p v-if="errorComprados" class="msg error">{{ errorComprados }}</p>
            <p v-else-if="comprasConsultadas && !comprados.length">Este cliente no tiene compras.</p>

            <table v-if="comprados.length">
                <thead>
                    <tr>
                        <th>ID compra</th>
                        <th>ID colchón</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Medidas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in comprados" :key="c.id_compra">
                        <td>{{ c.id_compra }}</td>
                        <td>{{ c.id_colchon }}</td>
                        <td>{{ c.nombre }}</td>
                        <td>{{ c.precio }}</td>
                        <td>{{ c.medidas }}</td>
                    </tr>
                </tbody>
            </table>
        </form>
    </section>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ColchonesView',

    data() {
        return {
            
            // getallcolchones
            colchones: [],
            colchonesCargados: false,
            loadingColchones: false,
            errorColchones: '',

            // buycolchon
            formCompra: {
                id_colchon: '',
                documento_cliente: '',
            },
            buying: false,
            mensajeCompra: '',
            errorCompra: '',

            // getcolchonescomprados
            documentoConsulta: '',
            comprados: [],
            comprasConsultadas: false,
            loadingComprados: false,
            errorComprados: '',
        }
    },

    methods: {
        // 1) GET /getallcolchones
        async getAllColchones() {
            this.loadingColchones = true
            this.errorColchones = ''
            try {
                const response = await axios.get("getallcolchones")
                this.colchones = response.data
                this.colchonesCargados = true
            } catch (error) {
                this.colchones = []
                this.errorColchones = this.getErrorMessage(error)
            } finally {
                this.loadingColchones = false
            }
        },

        // 2) POST /buycolchon
        async buyColchon() {
            this.buying = true
            this.errorCompra = ''
            this.mensajeCompra = ''
            try {
                const response = await axios.post("buycolchon", {
                    id_colchon: Number(this.formCompra.id_colchon),
                    documento_cliente: Number(this.formCompra.documento_cliente),
                })
                this.mensajeCompra = response.data.message // status 201
            } catch (error) {
                this.errorCompra = this.getErrorMessage(error)
            } finally {
                this.buying = false
            }
        },

        // 3) GET /getcolchonescomprados?documento_cliente=...
        async getColchonesComprados() {
            this.loadingComprados = true
            this.errorComprados = ''
            this.comprasConsultadas = false
            try {
                const response = await axios.get("getcolchonescomprados", {
                    params: { documento_cliente: this.documentoConsulta },
                })
                this.comprados = response.data
                this.comprasConsultadas = true
            } catch (error) {
                this.comprados = []
                this.errorComprados = this.getErrorMessage(error)
            } finally {
                this.loadingComprados = false
            }
        },

        // Auxiliar: extrae el mensaje de error del API (400, 404, 500) o el error de red
        getErrorMessage(error) {
            if (error.response) {
                return `Error ${error.response.status}: ${error.response.data?.error || 'Error del servidor'}`
            }
            return `Sin respuesta del servidor: ${error.message}`
        },
    },
}
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: system-ui, sans-serif;
}

.muted {
    color: #6b7280;
    font-size: 0.85rem;
    margin-top: -0.5rem;
}

.card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

form.card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.9rem;
}

input[type='text'] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 0.5rem 1rem;
    border: 0;
    border-radius: 4px;
    background: #2563eb;
    color: #fff;
    cursor: pointer;
}

button.small {
    padding: 0.25rem 0.6rem;
    font-size: 0.8rem;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0.75rem;
}

th,
td {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
    font-size: 0.9rem;
}

.msg {
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    margin: 0;
}

.msg.error {
    background: #fee2e2;
    color: #991b1b;
}

.msg.ok {
    background: #dcfce7;
    color: #166534;
}
</style>