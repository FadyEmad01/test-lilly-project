import Container from "@/components/layout/Container";
import { CardGridWrap } from "@/components/post/card-grid";
import { CARDS_POSTS } from "@/constants/POSTS";

export default function page() {
  return (
    <>
      <div className='bg-background w-full flex justify-center pt-[80px] '>
        <Container className="w-full">
          <div className="w-full flex flex-col items-center overflow-hidden">
            <CardGridWrap posts={CARDS_POSTS} />
          </div>
        </Container>
      </div>
    </>

  )
}
