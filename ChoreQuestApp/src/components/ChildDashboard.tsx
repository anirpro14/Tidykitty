import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {User, Task} from '../types';

interface ChildDashboardProps {
  user: User;
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

export function ChildDashboard({user, tasks, onCompleteTask}: ChildDashboardProps) {
  const myTasks = tasks.filter(task => task.assignedTo === user.id);
  const completedTasks = myTasks.filter(task => task.completed);
  const pendingTasks = myTasks.filter(task => !task.completed);
  const todaysTasks = myTasks.filter(
    task => task.dueDate === new Date().toISOString().split('T')[0],
  );

  const progressPercentage = Math.round((user.points / (user.level * 300)) * 100);
  const totalTasksToday = todaysTasks.length;
  const completedToday = todaysTasks.filter(t => t.completed).length;

  const handleCompleteTask = (taskId: string) => {
    Alert.alert(
      'Complete Task',
      'Are you sure you want to mark this task as complete?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Complete',
          onPress: () => {
            onCompleteTask(taskId);
            Alert.alert('Great job!', 'Task completed! You earned points! 🎉');
          },
        },
      ],
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <LinearGradient colors={['#8B5CF6', '#14B8A6']} style={styles.header}>
        <Text style={styles.headerTitle}>Hi {user.name}! 👋</Text>
        <Text style={styles.headerSubtitle}>Ready to earn some points today?</Text>
        <Text style={styles.avatar}>{user.avatar}</Text>

        {/* Level Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            Level {user.level} Progress
          </Text>
          <Text style={styles.progressText}>
            {user.points}/{user.level * 300} XP
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${Math.min(progressPercentage, 100)}%`},
              ]}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.points}</Text>
          <Text style={styles.statLabel}>My Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedTasks.length}</Text>
          <Text style={styles.statLabel}>Tasks Done</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingTasks.length}</Text>
          <Text style={styles.statLabel}>To Do</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.level}</Text>
          <Text style={styles.statLabel}>My Level</Text>
        </View>
      </View>

      {/* Today's Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Today's Progress</Text>
        <View style={styles.todayProgress}>
          <Text style={styles.todayText}>
            Tasks completed today: {completedToday}/{totalTasksToday}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    totalTasksToday > 0 ? (completedToday / totalTasksToday) * 100 : 0
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        {totalTasksToday === completedToday && totalTasksToday > 0 && (
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationTitle}>Great job!</Text>
            <Text style={styles.celebrationText}>
              You've completed all your tasks for today!
            </Text>
          </View>
        )}
      </View>

      {/* My Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 My Tasks</Text>
        {pendingTasks.length > 0 ? (
          pendingTasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    {backgroundColor: getDifficultyColor(task.difficulty)},
                  ]}>
                  <Text style={styles.difficultyText}>{task.difficulty}</Text>
                </View>
              </View>
              
              <Text style={styles.taskDescription}>{task.description}</Text>
              
              <View style={styles.taskFooter}>
                <Text style={styles.taskCategory}>{task.category}</Text>
                <Text style={styles.taskPoints}>⭐ {task.points} points</Text>
              </View>

              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleCompleteTask(task.id)}>
                <Text style={styles.completeButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>All done!</Text>
            <Text style={styles.emptyText}>
              You've completed all your tasks. Great work!
            </Text>
          </View>
        )}
      </View>

      {/* Recent Achievements */}
      {completedTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Recent Achievements</Text>
          {completedTasks
            .slice(-3)
            .reverse()
            .map(task => (
              <View key={task.id} style={styles.achievementCard}>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{task.title}</Text>
                  <Text style={styles.achievementDate}>
                    Completed{' '}
                    {task.completedAt &&
                      new Date(task.completedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.achievementPoints}>+{task.points}</Text>
              </View>
            ))}
        </View>
      )}
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
    marginBottom: 16,
  },
  avatar: {
    fontSize: 48,
    marginBottom: 16,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FCD34D',
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  todayProgress: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  todayText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  celebrationCard: {
    backgroundColor: '#DCFCE7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  celebrationText: {
    fontSize: 14,
    color: '#16A34A',
    textAlign: 'center',
  },
  taskCard: {
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  taskPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  completeButton: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementCard: {
    backgroundColor: '#DCFCE7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
  },
  achievementDate: {
    fontSize: 14,
    color: '#16A34A',
  },
  achievementPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
});