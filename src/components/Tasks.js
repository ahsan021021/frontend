import React from 'react';
import Contacts from './Contacts';

const Tasks = () => {
    // Ensure Contacts.default is an array
    if (!Array.isArray(Contacts.default)) {
        return <div>Error: Contacts is not an array</div>;
    }

    return (
        <div>
            {Contacts.default.map(contact => (
                <div key={contact.id}>{contact.name}</div>
            ))}
        </div>
    );
};

export default Tasks;
