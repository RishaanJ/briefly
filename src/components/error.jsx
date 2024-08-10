import { useParams } from 'react-router-dom';

function Error() {
  const { id } = useParams();
  
  // You can now use `id` to fetch or display specific error messages.
  return (
    <div>
      <img className='errorimg' src={`https://httpgoats.com/${id}.jpg`}/>
    </div>
  );
}


export default Error;