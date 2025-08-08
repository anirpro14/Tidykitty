import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginScreen} from './src/components/LoginScreen';
import {ParentDashboard} from './src/components/ParentDashboard';
import {ChildDashboard} from './src/components/ChildDashboard';
import {User, Task, Reward, AuthState, Family, TaskSuggestion} from './src/types';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    family: null,
    isFirstTime: false,
    isChildJoining: false,
  });

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'parent-1',
    name: 'Sarah',
    avatar: '👩‍💼',
    level: 1,
    points: 0,
    totalPoints: 0,
    streak: 0,
    badges: [],
    role: 'parent',
    familyId: 'family-1',
  });

  const [family, setFamily] = useState<Family>({
    id: 'family-1',
    name: 'The Johnson Family',
    members: [
      {
        id: 'parent-1',
        name: 'Sarah',
        avatar: '👩‍💼',
        level: 1,
        points: 0,
        totalPoints: 0,
        streak: 0,
        badges: [],
        role: 'parent',
        familyId: 'family-1',
      },
      {
        id: 'child-1',
        name: 'Emma',
        avatar: '👧',
        level: 2,
        points: 45,
        totalPoints: 180,
        streak: 3,
        badges: ['first-task'],
        role: 'child',
        familyId: 'family-1',
        parentId: 'parent-1',
      },
    ],
    createdAt: new Date().toISOString(),
    inviteCode: 'FAMILY123',
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Make your bed',
      description: 'Tidy up your bedroom and make the bed neatly',
      points: 10,
      difficulty: 'easy',
      category: 'Bedroom',
      assignedTo: 'child-1',
      assignedBy: 'parent-1',
      completed: false,
      dueDate: '2025-01-09',
    },
    {
      id: 'task-2',
      title: 'Put away clean dishes',
      description: 'Help put clean dishes back in their proper places',
      points: 15,
      difficulty: 'medium',
      category: 'Kitchen',
      assignedTo: 'child-1',
      assignedBy: 'parent-1',
      completed: true,
      completedAt: '2025-01-08',
    },
    {
      id: 'task-3',
      title: 'Complete homework',
      description: 'Finish all homework assignments before play time',
      points: 20,
      difficulty: 'medium',
      category: 'Study Time',
      assignedTo: 'child-1',
      assignedBy: 'parent-1',
      completed: false,
      dueDate: '2025-01-10',
    },
  ]);

  const handleLogin = (email: string, password: string) => {
    setAuthState({
      isAuthenticated: true,
      user: currentUser,
      family,
      isFirstTime: false,
      isChildJoining: false,
    });
  };

  const handleSignUp = (email: string, password: string, name: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      avatar: '👨‍💼',
      level: 1,
      points: 0,
      totalPoints: 0,
      streak: 0,
      badges: [],
      role: 'parent',
      familyId: '',
    };

    setCurrentUser(newUser);
    setAuthState({
      isAuthenticated: true,
      user: newUser,
      family: null,
      isFirstTime: true,
      isChildJoining: false,
    });
  };

  const completeTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId && !task.completed) {
          // Update user points
          if (task.assignedTo === currentUser.id) {
            setCurrentUser(user => ({
              ...user,
              points: user.points + task.points,
              totalPoints: user.totalPoints + task.points,
            }));
          } else {
            // Update child's points in family
            setFamily(prevFamily => ({
              ...prevFamily,
              members: prevFamily.members.map(member =>
                member.id === task.assignedTo
                  ? {
                      ...member,
                      points: member.points + task.points,
                      totalPoints: member.totalPoints + task.points,
                    }
                  : member,
              ),
            }));
          }

          return {
            ...task,
            completed: true,
            completedAt: new Date().toISOString(),
          };
        }
        return task;
      }),
    );
  };

  const createTask = (newTask: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks(prev => [...prev, task]);
  };

  function ParentTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#6B7280',
        }}>
        <Tab.Screen
          name="Dashboard"
          options={{tabBarLabel: '🏠 Dashboard'}}>
          {() => (
            <ParentDashboard
              user={currentUser}
              family={family}
              tasks={tasks}
              onCompleteTask={completeTask}
              onCreateTask={createTask}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  function ChildTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#6B7280',
        }}>
        <Tab.Screen
          name="Dashboard"
          options={{tabBarLabel: '🏠 Dashboard'}}>
          {() => (
            <ChildDashboard
              user={currentUser}
              tasks={tasks}
              onCompleteTask={completeTask}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login">
            {() => <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {currentUser.role === 'parent' ? <ParentTabs /> : <ChildTabs />}
    </NavigationContainer>
  );
}

export default App;