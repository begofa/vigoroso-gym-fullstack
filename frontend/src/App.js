import React, { useState, useEffect } from 'react';
import { 
  authService, 
  participantesService, 
  entrenamientoService, 
  nutricionService 
} from './services/api';
import './App.css';

// Importar iconos (se usarán CDN en producción o instalar lucide-react)
const DumbbellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="M12 5v14"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si hay sesión activa
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setView(user.rol === 'participante' ? 'participant-dashboard' : 'trainer-dashboard');
    }
  }, []);

  const handleLogin = async (email, password, isParticipant = false) => {
    setLoading(true);
    setError('');

    try {
      let data;
      if (isParticipant) {
        data = await authService.loginParticipante(email, password);
        setCurrentUser(data.participante);
        setView('participant-dashboard');
      } else {
        data = await authService.loginUsuario(email, password);
        setCurrentUser(data.usuario);
        setView('trainer-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setView('login');
  };

  return (
    <div className="App">
      {view === 'login' && (
        <LoginView onLogin={handleLogin} loading={loading} error={error} />
      )}
      {view === 'trainer-dashboard' && (
        <TrainerDashboard user={currentUser} onLogout={handleLogout} setView={setView} />
      )}
      {view === 'participant-dashboard' && (
        <ParticipantDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

// Componente de Login
function LoginView({ onLogin, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isParticipant, setIsParticipant] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password, isParticipant);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            <DumbbellIcon />
          </div>
          <h1 className="gym-title">VIGOROSO</h1>
          <p className="gym-subtitle">ENTRENA CON PROPÓSITO</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Iniciar Sesión</h2>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isParticipant}
                onChange={(e) => setIsParticipant(e.target.checked)}
              />
              <span>Soy participante</span>
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'INGRESANDO...' : 'INGRESAR'}
          </button>

          <div className="login-footer">
            <p>Demo: admin@gmail.com / admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Dashboard del Entrenador
function TrainerDashboard({ user, onLogout, setView }) {
  const [participantes, setParticipantes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: 'M'
  });
  const [loading, setLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    loadParticipantes();
  }, []);

  const loadParticipantes = async () => {
    try {
      const data = await participantesService.obtenerTodos();
      setParticipantes(data);
    } catch (error) {
      console.error('Error cargando participantes:', error);
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await participantesService.crear(newParticipant);
      setNewParticipant({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: 'M'
      });
      setShowAddForm(false);
      loadParticipantes();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al crear participante');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParticipant = async (id, nombre) => {
    if (window.confirm(`¿Eliminar a ${nombre}?`)) {
      try {
        await participantesService.eliminar(id);
        loadParticipantes();
      } catch (error) {
        alert('Error al eliminar participante');
      }
    }
  };

  if (selectedParticipant) {
    return (
      <ManageParticipant
        participant={selectedParticipant}
        onBack={() => setSelectedParticipant(null)}
        user={user}
      />
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <DumbbellIcon />
            <div>
              <h1 className="header-title">VIGOROSO</h1>
              <p className="header-subtitle">Panel de Entrenador</p>
            </div>
          </div>
          <div className="header-right">
            <span className="user-name">{user.nombre}</span>
            <button onClick={onLogout} className="btn-logout">
              <LogOutIcon />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card stat-orange">
            <div className="stat-header">
              <UserIcon />
              <span className="stat-value">{participantes.length}</span>
            </div>
            <p className="stat-label">Participantes Activos</p>
          </div>

          <div className="stat-card stat-blue">
            <div className="stat-header">
              <DumbbellIcon />
              <span className="stat-value">
                {participantes.reduce((acc, p) => acc + (p.total_planes_entrenamiento || 0), 0)}
              </span>
            </div>
            <p className="stat-label">Planes de Entrenamiento</p>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-header">
              <AppleIcon />
              <span className="stat-value">
                {participantes.reduce((acc, p) => acc + (p.total_planes_nutricion || 0), 0)}
              </span>
            </div>
            <p className="stat-label">Planes de Nutrición</p>
          </div>
        </div>

        <div className="participants-section">
          <div className="section-header">
            <h2>Gestión de Participantes</h2>
            <button onClick={() => setShowAddForm(true)} className="btn-primary">
              <PlusIcon />
              <span>Agregar Participante</span>
            </button>
          </div>

          {showAddForm && (
            <div className="add-form-container">
              <form onSubmit={handleAddParticipant} className="add-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre Completo *</label>
                    <input
                      type="text"
                      value={newParticipant.nombre}
                      onChange={(e) => setNewParticipant({...newParticipant, nombre: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={newParticipant.email}
                      onChange={(e) => setNewParticipant({...newParticipant, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Contraseña *</label>
                    <input
                      type="password"
                      value={newParticipant.password}
                      onChange={(e) => setNewParticipant({...newParticipant, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={newParticipant.telefono}
                      onChange={(e) => setNewParticipant({...newParticipant, telefono: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={newParticipant.fecha_nacimiento}
                      onChange={(e) => setNewParticipant({...newParticipant, fecha_nacimiento: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Género</label>
                    <select
                      value={newParticipant.genero}
                      onChange={(e) => setNewParticipant({...newParticipant, genero: e.target.value})}
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-success" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {participantes.length === 0 ? (
            <div className="empty-state">
              <UserIcon />
              <p>No hay participantes registrados</p>
            </div>
          ) : (
            <div className="participants-grid">
              {participantes.map(participant => (
                <div
                  key={participant.id}
                  className="participant-card"
                  onClick={() => setSelectedParticipant(participant)}
                >
                  <div className="participant-header">
                    <div className="participant-avatar">
                      <UserIcon />
                    </div>
                    <div className="participant-info">
                      <h3>{participant.nombre}</h3>
                      <p>{participant.email}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteParticipant(participant.id, participant.nombre);
                      }}
                      className="btn-icon-danger"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  <div className="participant-tags">
                    {participant.total_planes_entrenamiento > 0 && (
                      <span className="tag tag-blue">Plan Entrenamiento</span>
                    )}
                    {participant.total_planes_nutricion > 0 && (
                      <span className="tag tag-green">Plan Nutrición</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Gestión de participante individual
function ManageParticipant({ participant, onBack, user }) {
  const [activeTab, setActiveTab] = useState('training');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="btn-back">← Volver</button>
            <div className="participant-avatar-small">
              <UserIcon />
            </div>
            <div>
              <h1 className="header-title">{participant.nombre}</h1>
              <p className="header-subtitle">Gestión de Planes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => setActiveTab('training')}
          >
            <DumbbellIcon />
            <span>Plan de Entrenamiento</span>
          </button>
          <button
            className={`tab ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => setActiveTab('nutrition')}
          >
            <AppleIcon />
            <span>Plan de Nutrición</span>
          </button>
        </div>

        {activeTab === 'training' && (
          <TrainingPlanManager participantId={participant.id} userId={user.id} />
        )}
        {activeTab === 'nutrition' && (
          <NutritionPlanManager participantId={participant.id} userId={user.id} />
        )}
      </main>
    </div>
  );
}

// Gestor de plan de entrenamiento
function TrainingPlanManager({ participantId, userId }) {
  const [plan, setPlan] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [rutinaDiaria, setRutinaDiaria] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    loadPlan();
  }, [participantId]);

  const loadPlan = async () => {
    try {
      const data = await entrenamientoService.obtenerPlan(participantId, currentMonth);
      setPlan(data.plan);
      setRutinaDiaria(data.plan?.rutina_diaria || '');
      
      if (data.ejercicios && data.ejercicios.length > 0) {
        setEjercicios(data.ejercicios);
      } else {
        // Crear estructura vacía
        const emptyEjercicios = [];
        dias.forEach(dia => {
          for (let i = 1; i <= 6; i++) {
            emptyEjercicios.push({
              dia_semana: dia,
              orden: i,
              es_rutina_diaria: false,
              nombre_ejercicio: '',
              ejercicio_secundario: '',
              series: '',
              series_secundario: '',
              repeticiones: '',
              repeticiones_secundario: '',
              tipo_ejercicio: 'normal',
              categoria_id: null,
              notas: ''
            });
          }
        });
        setEjercicios(emptyEjercicios);
      }
    } catch (error) {
      console.error('Error cargando plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await entrenamientoService.guardarPlan({
        participante_id: participantId,
        mes_año: currentMonth,
        rutina_diaria: rutinaDiaria,
        ejercicios: ejercicios
          .filter(e => (e.nombre_ejercicio || '').toString().trim() !== '')
          .map(e => ({
            dia_semana: e.dia_semana,
            orden: e.orden,
            es_rutina_diaria: e.es_rutina_diaria || false,
            nombre_ejercicio: e.nombre_ejercicio || null,
            ejercicio_secundario: e.ejercicio_secundario || null,
            series: e.series || null,
            series_secundario: e.series_secundario || null,
            repeticiones: e.repeticiones || null,
            repeticiones_secundario: e.repeticiones_secundario || null,
            tipo_ejercicio: e.tipo_ejercicio || 'normal',
            categoria_id: e.categoria_id || null,
            notas: e.notas || null
          }))
      });
      setEditing(false);
      loadPlan();
      alert('Plan guardado exitosamente');
    } catch (error) {
      alert('Error al guardar el plan');
    }
  };

  const updateEjercicio = (dia, orden, field, value) => {
    setEjercicios(prev => prev.map(e => 
      e.dia_semana === dia && e.orden === orden 
        ? { ...e, [field]: value }
        : e
    ));
  };

  const getEjerciciosByDia = (dia) => {
    return ejercicios.filter(e => e.dia_semana === dia).sort((a, b) => a.orden - b.orden);
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="plan-manager">
      <div className="plan-header">
        <div>
          <h2>Plan de Entrenamiento</h2>
          <p className="plan-month">
            Mes: {new Date(currentMonth + '-01').toLocaleDateString('es', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-primary">
            <EditIcon />
            <span>Editar Plan</span>
          </button>
        ) : (
          <div className="button-group">
            <button onClick={handleSave} className="btn-success">
              <SaveIcon />
              <span>Guardar</span>
            </button>
            <button onClick={() => { setEditing(false); loadPlan(); }} className="btn-secondary">
              <XIcon />
              <span>Cancelar</span>
            </button>
          </div>
        )}
      </div>

      <div className="days-list">
        {dias.map(dia => (
          <div key={dia} className="day-card">
            <button
              className="day-header"
              onClick={() => setExpandedDay(expandedDay === dia ? null : dia)}
            >
              <span className="day-name">{dia}</span>
              {expandedDay === dia ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </button>

            {expandedDay === dia && (
              <div className="day-exercises">
                {getEjerciciosByDia(dia).map(ejercicio => (
                  <div key={`${dia}-${ejercicio.orden}`} className="exercise-card">
                    <div className="exercise-grid">
                      <div className="exercise-field">
                        <label>Ejercicio {ejercicio.orden}</label>
                        <input
                          type="text"
                          value={ejercicio.nombre_ejercicio}
                          onChange={(e) => updateEjercicio(dia, ejercicio.orden, 'nombre_ejercicio', e.target.value)}
                          disabled={!editing}
                          placeholder="Nombre del ejercicio"
                        />
                      </div>
                      <div className="exercise-field">
                        <label>Series</label>
                        <input
                          type="text"
                          value={ejercicio.series}
                          onChange={(e) => updateEjercicio(dia, ejercicio.orden, 'series', e.target.value)}
                          disabled={!editing}
                          placeholder="3-4"
                        />
                      </div>
                      <div className="exercise-field">
                        <label>Repeticiones</label>
                        <input
                          type="text"
                          value={ejercicio.repeticiones}
                          onChange={(e) => updateEjercicio(dia, ejercicio.orden, 'repeticiones', e.target.value)}
                          disabled={!editing}
                          placeholder="8-12"
                        />
                      </div>
                      <div className="exercise-field exercise-field-full">
                        <label>Notas</label>
                        <input
                          type="text"
                          value={ejercicio.notas}
                          onChange={(e) => updateEjercicio(dia, ejercicio.orden, 'notas', e.target.value)}
                          disabled={!editing}
                          placeholder="Notas adicionales..."
                        />
                      </div>
                      <div className="exercise-field">
                        <label>Ejercicio Secundario</label>
                        <input
                          type="text"
                          value={ejercicio.ejercicio_secundario || ''}
                          onChange={(e) => updateEjercicio(dia, ejercicio.orden, 'ejercicio_secundario', e.target.value)}
                          disabled={!editing}
                          placeholder="Ejercicio secundario (superserie)"
                        />
                      </div>
                      <div className="exercise-field">
                        <label>Series Sec.</label>
                        <input
                          type="text"
                          value={ejercicio.series_secundario || ''}
                          onChange={(e) => updateEjercicio(dia, ejercicio.orden, 'series_secundario', e.target.value)}
                          disabled={!editing}
                          placeholder="2"
                        />
                      </div>
                      <div className="exercise-field">
                        <label>Reps Sec.</label>
                        <input
                          type="text"
                          value={ejercicio.repeticiones_secundario || ''}
                          onChange={(e) => updateEjercicio(dia, ejercicio.orden, 'repeticiones_secundario', e.target.value)}
                          disabled={!editing}
                          placeholder="10"
                        />
                      </div>
                      <div className="exercise-field">
                        <label>Tipo</label>
                        <select
                          value={ejercicio.tipo_ejercicio || 'normal'}
                          onChange={(e) => updateEjercicio(dia, ejercicio.orden, 'tipo_ejercicio', e.target.value)}
                          disabled={!editing}
                        >
                          <option value="normal">Normal</option>
                          <option value="superserie">Superserie</option>
                          <option value="tiempo">Tiempo</option>
                          <option value="solo_descripcion">Solo descripción</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="routine-section">
        <h3>Rutina diaria</h3>
        <textarea
          value={rutinaDiaria}
          onChange={(e) => setRutinaDiaria(e.target.value)}
          disabled={!editing}
          placeholder="Escribe la rutina diaria (cardio, movilidad, etc.)"
          rows={4}
          className="rutina-textarea"
        />
      </div>
    </div>
  );
}

// Gestor de plan de nutrición
function NutritionPlanManager({ participantId, userId }) {
  const [plan, setPlan] = useState(null);
  const [comidas, setComidas] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const tiposComida = ['Desayuno', 'Media Mañana', 'Almuerzo', 'Merienda', 'Cena'];

  useEffect(() => {
    loadPlan();
  }, [participantId]);

  const loadPlan = async () => {
    try {
      const data = await nutricionService.obtenerPlan(participantId);
      setPlan(data.plan);
      
      if (data.comidas && data.comidas.length > 0) {
        setComidas(data.comidas);
        setRecomendaciones(data.plan?.recomendaciones_generales || '');
      } else {
        // Crear estructura vacía
        const emptyComidas = tiposComida.map(tipo => ({
          tipo_comida: tipo,
          opcion_1: '',
          opcion_2: ''
        }));
        setComidas(emptyComidas);
      }
    } catch (error) {
      console.error('Error cargando plan de nutrición:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await nutricionService.guardarPlan({
        participante_id: participantId,
        recomendaciones_generales: recomendaciones,
        comidas: comidas
      });
      setEditing(false);
      loadPlan();
      alert('Plan de nutrición guardado exitosamente');
    } catch (error) {
      alert('Error al guardar el plan');
    }
  };

  const updateComida = (tipo, field, value) => {
    setComidas(prev => prev.map(c => 
      c.tipo_comida === tipo 
        ? { ...c, [field]: value }
        : c
    ));
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="plan-manager">
      <div className="plan-header">
        <h2>Plan de Nutrición</h2>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-primary btn-green">
            <EditIcon />
            <span>Editar Plan</span>
          </button>
        ) : (
          <div className="button-group">
            <button onClick={handleSave} className="btn-success">
              <SaveIcon />
              <span>Guardar</span>
            </button>
            <button onClick={() => { setEditing(false); loadPlan(); }} className="btn-secondary">
              <XIcon />
              <span>Cancelar</span>
            </button>
          </div>
        )}
      </div>

      <div className="nutrition-list">
        {comidas.map(comida => (
          <div key={comida.tipo_comida} className="meal-card">
            <h3 className="meal-title">{comida.tipo_comida}</h3>
            <div className="meal-options">
              <div className="meal-option">
                <label>Opción 1</label>
                <textarea
                  value={comida.opcion_1}
                  onChange={(e) => updateComida(comida.tipo_comida, 'opcion_1', e.target.value)}
                  disabled={!editing}
                  placeholder="Describe la primera opción..."
                  rows={3}
                />
              </div>
              <div className="meal-option">
                <label>Opción 2</label>
                <textarea
                  value={comida.opcion_2}
                  onChange={(e) => updateComida(comida.tipo_comida, 'opcion_2', e.target.value)}
                  disabled={!editing}
                  placeholder="Describe la segunda opción..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="recommendations-card">
          <h3 className="meal-title">Recomendaciones Adicionales</h3>
          <textarea
            value={recomendaciones}
            onChange={(e) => setRecomendaciones(e.target.value)}
            disabled={!editing}
            placeholder="Hidratación, suplementos, horarios..."
            rows={5}
          />
        </div>
      </div>
    </div>
  );
}

// Dashboard del Participante
function ParticipantDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('training');
  const [plan, setPlan] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [nutricionPlan, setNutricionPlan] = useState(null);
  const [comidas, setComidas] = useState([]);
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [registros, setRegistros] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [editingNotes, setEditingNotes] = useState({});

  const currentMonth = new Date().toISOString().slice(0, 7);
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    if (activeTab === 'training') {
      loadTrainingPlan();
      loadRegistros();
    } else if (activeTab === 'nutrition') {
      loadNutritionPlan();
    }
  }, [activeTab, user.id]);

  useEffect(() => {
    if (selectedDate) {
      loadRegistros();
    }
  }, [selectedDate]);

  const loadTrainingPlan = async () => {
    try {
      const data = await entrenamientoService.obtenerPlan(user.id, currentMonth);
      setPlan(data.plan);
      setEjercicios(data.ejercicios || []);
    } catch (error) {
      console.error('Error cargando plan:', error);
    }
  };

  const loadNutritionPlan = async () => {
    try {
      const data = await nutricionService.obtenerPlan(user.id);
      setNutricionPlan(data.plan);
      setComidas(data.comidas || []);
    } catch (error) {
      console.error('Error cargando plan de nutrición:', error);
    }
  };

  const loadRegistros = async () => {
    try {
      const data = await entrenamientoService.obtenerRegistros(user.id, selectedDate, selectedDate);
      const registrosMap = {};
      data.forEach(reg => {
        registrosMap[reg.ejercicio_plan_id] = reg;
      });
      setRegistros(registrosMap);
    } catch (error) {
      console.error('Error cargando registros:', error);
    }
  };

  const handleRegistrarPeso = async (ejercicioId, peso, comentarios = '') => {
    try {
      const registro = {
        participante_id: user.id,
        ejercicio_plan_id: ejercicioId,
        fecha_registro: selectedDate,
        peso_utilizado: parseFloat(peso) || 0,
        comentarios: comentarios || ''
      };

      if (registros[ejercicioId]) {
        await entrenamientoService.actualizarRegistro(registros[ejercicioId].id, registro);
      } else {
        await entrenamientoService.registrarEntrenamiento(registro);
      }

      loadRegistros();
    } catch (error) {
      console.error('Error registrando peso:', error);
    }
  };

  const handleShowHistory = async (ejercicio) => {
    try {
      setSelectedExercise(ejercicio);
      const history = await entrenamientoService.obtenerHistorialEjercicio(user.id, ejercicio.id);
      setExerciseHistory(history);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Error cargando historial:', error);
      alert('Error al cargar el historial');
    }
  };

  const handleUpdateNotes = (ejercicioId, notas) => {
    setEditingNotes(prev => ({
      ...prev,
      [ejercicioId]: notas
    }));
  };

  const handleSaveNotes = async (ejercicioId) => {
    const peso = registros[ejercicioId]?.peso_utilizado || 0;
    const notas = editingNotes[ejercicioId] || registros[ejercicioId]?.comentarios || '';
    await handleRegistrarPeso(ejercicioId, peso, notas);
    setEditingNotes(prev => {
      const updated = { ...prev };
      delete updated[ejercicioId];
      return updated;
    });
  };

  const getEjerciciosByDia = (dia) => {
    return ejercicios.filter(e => e.dia_semana === dia).sort((a, b) => a.orden - b.orden);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <DumbbellIcon />
            <div>
              <h1 className="header-title">VIGOROSO</h1>
              <p className="header-subtitle">Hola, {user.nombre}</p>
            </div>
          </div>
          <button onClick={onLogout} className="btn-logout">
            <LogOutIcon />
            <span>Salir</span>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => setActiveTab('training')}
          >
            <DumbbellIcon />
            <span>Mi Entrenamiento</span>
          </button>
          <button
            className={`tab ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => setActiveTab('nutrition')}
          >
            <AppleIcon />
            <span>Mi Nutrición</span>
          </button>
        </div>

        {activeTab === 'training' && (
          <div className="participant-training">
            {!plan ? (
              <div className="empty-state">
                <DumbbellIcon />
                <p>No tienes un plan de entrenamiento asignado para este mes</p>
              </div>
            ) : (
              <>
                <div className="date-selector">
                  <label>Fecha de Registro:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="days-list">
                  {dias.map(dia => {
                    const ejerciciosDia = getEjerciciosByDia(dia);
                    if (ejerciciosDia.length === 0 || !ejerciciosDia.some(e => e.nombre_ejercicio)) {
                      return null;
                    }

                    return (
                      <div key={dia} className="day-card">
                        <button
                          className="day-header"
                          onClick={() => setExpandedDay(expandedDay === dia ? null : dia)}
                        >
                          <span className="day-name">{dia}</span>
                          {expandedDay === dia ? <ChevronDownIcon /> : <ChevronRightIcon />}
                        </button>

                        {expandedDay === dia && (
                          <div className="day-exercises">
                            {ejerciciosDia.map(ejercicio => {
                              if (!ejercicio.nombre_ejercicio) return null;
                              
                              const registro = registros[ejercicio.id];
                              const notasActuales = editingNotes[ejercicio.id] !== undefined 
                                ? editingNotes[ejercicio.id] 
                                : (registro?.comentarios || '');

                              return (
                                <div key={ejercicio.id} className="participant-exercise-card-enhanced">
                                  <div className="exercise-header-row">
                                    <div className="exercise-info">
                                      <h4>{ejercicio.nombre_ejercicio}</h4>
                                      <p className="exercise-plan-info">
                                        {ejercicio.series} series × {ejercicio.repeticiones} reps
                                      </p>
                                      {ejercicio.notas && (
                                        <p className="exercise-notes">
                                          <strong>Instrucción:</strong> {ejercicio.notas}
                                        </p>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => handleShowHistory(ejercicio)}
                                      className="btn-history"
                                      title="Ver historial"
                                    >
                                      📊 Historial
                                    </button>
                                  </div>

                                  <div className="exercise-log-enhanced">
                                    <div className="weight-input-group">
                                      <label>Peso usado (kg):</label>
                                      <input
                                        type="number"
                                        step="0.5"
                                        value={registro?.peso_utilizado || ''}
                                        onChange={(e) => handleRegistrarPeso(ejercicio.id, e.target.value, notasActuales)}
                                        placeholder="0"
                                        className="weight-input"
                                      />
                                      {registro?.peso_utilizado && (
                                        <span className="weight-saved">✓ Guardado</span>
                                      )}
                                    </div>

                                    <div className="notes-input-group">
                                      <label>Observaciones personales:</label>
                                      <div className="notes-with-button">
                                        <textarea
                                          value={notasActuales}
                                          onChange={(e) => handleUpdateNotes(ejercicio.id, e.target.value)}
                                          placeholder="Ej: Sentí mucha fuerza hoy, aumentar peso próxima vez..."
                                          rows={2}
                                          className="notes-textarea"
                                        />
                                        {editingNotes[ejercicio.id] !== undefined && 
                                         editingNotes[ejercicio.id] !== (registro?.comentarios || '') && (
                                          <button
                                            onClick={() => handleSaveNotes(ejercicio.id)}
                                            className="btn-save-notes"
                                          >
                                            💾 Guardar Nota
                                          </button>
                                        )}
                                      </div>
                                      {registro?.comentarios && editingNotes[ejercicio.id] === undefined && (
                                        <p className="saved-notes">
                                          <strong>Última nota:</strong> {registro.comentarios}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="participant-nutrition">
            {!nutricionPlan ? (
              <div className="empty-state">
                <AppleIcon />
                <p>No tienes un plan de nutrición asignado</p>
              </div>
            ) : (
              <>
                <div className="nutrition-list">
                  {comidas.map(comida => (
                    <div key={comida.tipo_comida} className="meal-card">
                      <h3 className="meal-title">{comida.tipo_comida}</h3>
                      <div className="meal-options">
                        <div className="meal-option meal-option-readonly">
                          <h4>Opción 1</h4>
                          <p>{comida.opcion_1 || 'No especificado'}</p>
                        </div>
                        <div className="meal-option meal-option-readonly">
                          <h4>Opción 2</h4>
                          <p>{comida.opcion_2 || 'No especificado'}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {nutricionPlan.recomendaciones_generales && (
                    <div className="recommendations-card recommendations-readonly">
                      <h3 className="meal-title">Recomendaciones Adicionales</h3>
                      <p>{nutricionPlan.recomendaciones_generales}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Modal de Historial */}
      {showHistoryModal && selectedExercise && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Historial: {selectedExercise.nombre_ejercicio}</h2>
              <button onClick={() => setShowHistoryModal(false)} className="btn-close-modal">
                <XIcon />
              </button>
            </div>
            
            <div className="modal-body">
              {exerciseHistory.length === 0 ? (
                <div className="empty-state-small">
                  <p>No hay registros previos para este ejercicio</p>
                </div>
              ) : (
                <div className="history-list">
                  <div className="history-stats">
                    <div className="stat-box">
                      <span className="stat-label">Máximo registrado</span>
                      <span className="stat-value-large">
                        {Math.max(...exerciseHistory.map(h => h.peso_utilizado || 0))} kg
                      </span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Promedio</span>
                      <span className="stat-value-large">
                        {(exerciseHistory.reduce((acc, h) => acc + (h.peso_utilizado || 0), 0) / exerciseHistory.length).toFixed(1)} kg
                      </span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Sesiones</span>
                      <span className="stat-value-large">{exerciseHistory.length}</span>
                    </div>
                  </div>

                  <div className="history-timeline">
                    {exerciseHistory.map((record, index) => (
                      <div key={record.id} className="history-record">
                        <div className="record-date">
                          <span className="date-day">
                            {new Date(record.fecha_registro).toLocaleDateString('es', { 
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                          <span className="date-year">
                            {new Date(record.fecha_registro).getFullYear()}
                          </span>
                        </div>
                        <div className="record-details">
                          <div className="record-weight">
                            <strong>{record.peso_utilizado || 0} kg</strong>
                            {index < exerciseHistory.length - 1 && (
                              <span className={`weight-change ${
                                (record.peso_utilizado || 0) > (exerciseHistory[index + 1].peso_utilizado || 0)
                                  ? 'positive'
                                  : (record.peso_utilizado || 0) < (exerciseHistory[index + 1].peso_utilizado || 0)
                                  ? 'negative'
                                  : 'neutral'
                              }`}>
                                {(record.peso_utilizado || 0) > (exerciseHistory[index + 1].peso_utilizado || 0) && '↑'}
                                {(record.peso_utilizado || 0) < (exerciseHistory[index + 1].peso_utilizado || 0) && '↓'}
                                {(record.peso_utilizado || 0) === (exerciseHistory[index + 1].peso_utilizado || 0) && '='}
                                {' '}
                                {Math.abs((record.peso_utilizado || 0) - (exerciseHistory[index + 1].peso_utilizado || 0))} kg
                              </span>
                            )}
                          </div>
                          {record.comentarios && (
                            <div className="record-notes">
                              <em>"{record.comentarios}"</em>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
