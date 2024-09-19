import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Button, Card, Modal, Form } from 'react-bootstrap';

const MyWorkouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [show, setShow] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ name: '', duration: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` // Pass the token if required
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
        setMessage(`Failed to fetch workouts: ${error.message}`);
      }
    };

    fetchWorkouts();
  }, [user]);

  const handleAddWorkout = async () => {
    try {
      const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newWorkout),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setWorkouts([...workouts, data]);
      setShow(false);
      setNewWorkout({ name: '', duration: '' });
    } catch (error) {
      console.error('Failed to add workout:', error);
      setMessage(`Failed to add workout: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>My Workouts</h2>
      {message && <p>{message}</p>}
      <Button id="addWorkout" onClick={() => setShow(true)}>Add Workout</Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formWorkoutName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter workout name"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formWorkoutDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter duration"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddWorkout}>
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <div className="workout-list">
        {workouts.map((workout) => (
          <Card key={workout._id} style={{ width: '18rem', marginBottom: '1rem' }}>
            <Card.Body>
              <Card.Title>{workout.name}</Card.Title>
              <Card.Text>Duration: {workout.duration}</Card.Text>
              <Card.Text>Date Added: {new Date(workout.dateAdded).toLocaleDateString()}</Card.Text>
              <Card.Text>Status: {workout.status}</Card.Text>
              {/* Implement CompleteWorkout, UpdateWorkout, and DeleteWorkout */}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyWorkouts;