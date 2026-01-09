
import React from 'react';
import { useParams } from 'react-router-dom';
import EventForm from '../components/EventForm';
import { getEventById } from '../services/eventService';
import { AdmissionEvent } from '../types';

const AddEditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = React.useState<AdmissionEvent | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      const found = getEventById(id);
      setEvent(found);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <EventForm initialData={event} />
    </div>
  );
};
export default AddEditEvent;
