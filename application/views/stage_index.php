<?php defined('SYSPATH') OR die('No direct access allowed.'); ?>
<ul>
<?php foreach ($stages as $stage): ?>
	<li><?php echo $stage->name; ?></li>
<?php endforeach ?>
</ul>