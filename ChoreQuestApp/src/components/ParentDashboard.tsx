import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {User, Task, Family} from '../types';

interface ParentDashboardProps {
  user: User;
  family: Family;
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  onCreateTask: (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => void;
}

export function ParentDashboard({
  user,
  family,
  tasks,
  onCompleteTask,
  onCreateTask,
}: ParentDashboardProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    points: 10,
    difficulty: 'easy' as const,
    category: 'General',
    assignedTo: '',
    dueDate: '',
  });

  const children = family.members.filter(member => member.role === 'child');
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const handleCreateTask = () => {
    setShowTaskForm(true);
  };

  const handleSubmitTask = () => {
    if (!newTask.title.trim() || !newTask.assignedTo) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onCreateTask({
      ...newTask,
      assignedBy: user.id,
    });

    setNewTask({
      title: '',
      description: '',
      points: 10,
      difficulty: 'easy',
      category: 'General',
      assignedTo: '',
      dueDate: '',
    });
    setShowTaskForm(false);
    Alert.alert('Success', 'Task created successfully!');
  };

  const sendInviteLink = () => {
    const inviteLink = `https://tidykitty.app?invite=${family.inviteCode}`;
    const subject = `Join ${family.name} on TidyKitty!`;
    const body = `Hi! You've been invited to join our family on TidyKitty, where we make chores fun and rewarding!\n\nClick this link to get started: ${inviteLink}\n\nSee you there!`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoLink);
  };

  const getChildStats = (childId: string) => {
    const childTasks = tasks.filter(task => task.assignedTo === childId);
    const completed = childTasks.filter(task => task.completed).length;
    const pending = childTasks.length - completed;
    const totalPoints = childTasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.points, 0);

    return {total: childTasks.length, completed, pending, totalPoints};
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <LinearGradient colors={['#8B5CF6', '#14B8A6']} style={styles.header}>
        <Text style={styles.headerTitle}>Welcome back, {user.name}! 👋</Text>
        <Text style={styles.headerSubtitle}>
          Monitor your family's progress and celebrate their achievements!
        </Text>
        <Text style={styles.avatar}>{user.avatar}</Text>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{children.length}</Text>
          <Text style={styles.statLabel}>Children</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.inviteButton} onPress={sendInviteLink}>
          <Text style={styles.buttonText}>📧 Send Invite Link</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addTaskButton} onPress={handleCreateTask}>
          <Text style={styles.buttonText}>➕ Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Children Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Children's Progress</Text>
        {children.map(child => {
          const stats = getChildStats(child.id);
          const progressPercentage =
            stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

          return (
            <View key={child.id} style={styles.childCard}>
              <View style={styles.childHeader}>
                <Text style={styles.childAvatar}>{child.avatar}</Text>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childLevel}>Level {child.level}</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {stats.completed}/{stats.total} tasks
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {width: `${progressPercentage}%`},
                    ]}
                  />
                </View>
              </View>

              <View style={styles.childStats}>
                <View style={styles.childStat}>
                  <Text style={styles.childStatValue}>{stats.completed}</Text>
                  <Text style={styles.childStatLabel}>Done</Text>
                </View>
                <View style={styles.childStat}>
                  <Text style={styles.childStatValue}>{stats.pending}</Text>
                  <Text style={styles.childStatLabel}>Pending</Text>
                </View>
                <View style={styles.childStat}>
                  <Text style={styles.childStatValue}>{stats.totalPoints}</Text>
                  <Text style={styles.childStatLabel}>Points</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Task Creation Modal */}
      <Modal visible={showTaskForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>

            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={newTask.title}
              onChangeText={text => setNewTask({...newTask, title: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTask.description}
              onChangeText={text => setNewTask({...newTask, description: text})}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Points"
              value={newTask.points.toString()}
              onChangeText={text =>
                setNewTask({...newTask, points: parseInt(text) || 10})
              }
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowTaskForm(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitTask}>
                <Text style={styles.submitButtonText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    borderRadius: 16,
    margin: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 48,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  inviteButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addTaskButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  childCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  childAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  childLevel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  childStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  childStat: {
    alignItems: 'center',
  },
  childStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  childStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});