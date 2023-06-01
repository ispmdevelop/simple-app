import { ScrollArea } from '~/components/ui/scroll-area';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';

export default function ChatRun() {
  return (
    <>
      <div className='flex flex-col p-3 gap-2' style={{ height: '100vh' }}>
        <ScrollArea
          className='border-2 px-2 py-1 rounded'
          style={{ height: '94%' }}
        >
          <div className='flex flex-col p-2 w-full gap-2'>
            <div className='flex flex-row h-fit'>
              <Avatar className='my-auto mr-2'>
                <AvatarFallback className='bg-gray-500  text-white'>
                  S
                </AvatarFallback>
              </Avatar>
              <div
                className='bg-gray-200 w-fit p-2 rounded-lg'
                style={{ maxWidth: '70%' }}
              >
                <p className='text-black'>
                  User 1 Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Facere tempore in praesentium. Aspernatur consectetur
                  perspiciatis quibusdam suscipit dignissimos similique rerum
                  quo blanditiis error earum veritatis quidem, repellat deserunt
                  quaerat, cumque itaque? Velit accusantium nostrum corporis
                  natus iste quo sed, assumenda soluta! Nam omnis vero suscipit,
                  ducimus deleniti officiis minima provident! Nulla repellat
                  illo dolores reiciendis, porro voluptas odio nobis, illum
                  aliquid optio, quod voluptatem praesentium explicabo magnam
                  eligendi ad est at iusto laudantium minus pariatur atque ullam
                  impedit modi? Aliquid quae molestias consequuntur. Quod qui
                  culpa ipsa pariatur inventore, provident quasi quas magni
                  ipsum. At aperiam nihil laborum quasi harum.
                </p>
              </div>
            </div>

            <div className='h-fit'>
              <div
                className='bg-blue-500 w-fit p-2 rounded-lg ml-auto'
                style={{ maxWidth: '70%' }}
              >
                <p className='text-white'>
                  User 2 Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Rem possimus fuga voluptatum. Eligendi odit dolor fugiat
                  natus quibusdam atque illum voluptate delectus. Ea cupiditate,
                  vero dolore veritatis corrupti officia vitae eveniet quae
                  quibusdam accusamus, recusandae repudiandae repellendus
                  accusantium explicabo quod ab minima aut, ex esse fugit
                  inventore. Consequatur maxime unde quis, incidunt quam aperiam
                  laborum dolore iure autem ipsum. Illo dicta in impedit atque
                  aliquam unde ab quis facilis! Officia architecto libero
                  laborum, quos nobis commodi tempore tempora! Laborum pariatur,
                  expedita, reiciendis itaque, reprehenderit facere at nemo
                  deserunt aliquam eum minima quae sed vero! Iure ipsam quae est
                  cupiditate excepturi.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div
          className='flex flex-row border-2 rounded'
          style={{ height: '7%' }}
        >
          <Textarea
            className='m-w-full m-h-full min-h-full resize-none  border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:ring-white focus-visible:ring-opacity-50 focus-visible:ring-offset-opacity-50
            focus-visible:border-2 focus-visible:border-blue-500'
            placeholder='Type your message here...'
          />
          <Button
            variant='outline'
            className='m-w-full m-h-full min-h-full text-blue-500 hover:bg-blue-500  border-0 hover:text-white'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
              className='fill-blue-700 w-6 h-6 hover:fill-white'
            >
              <path d='M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z' />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
}
