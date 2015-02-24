<?php
class HusseyCoding_InfiniteScroll_Model_Observer
{
    
    public function frontendControllerActionLayoutLoadBefore($observer)
    {
        $params = Mage::app()->getRequest()->getParams();
        if (isset($params['_escaped_fragment_'])):
            $observer->getLayout()->getUpdate()->addHandle('infinitescroll_all');
        endif;
    }
}
